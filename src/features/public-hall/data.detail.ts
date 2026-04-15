import { publicApi } from '@/api/public';
import { clubsApi } from '@/api/clubs';
import { operationsApi } from '@/api/operations';
import type { ClubPublicProfile, TournamentPublicProfile } from '@/domain/public';

import type { ClubDetailState, TournamentDetailState } from './types';
import { mapTournamentDetailFromAdminView } from './data.shared';

export async function loadTournamentDetail(tournamentId: string): Promise<TournamentDetailState> {
  try {
    const item = await publicApi.getPublicTournamentProfile(tournamentId);
    return { item, source: 'api' };
  } catch (error) {
    try {
      const draftItem = await operationsApi.getTournament(tournamentId);
      return {
        item: mapTournamentDetailFromAdminView(draftItem),
        source: 'api',
        warning: 'This tournament is still in draft mode and is shown through the admin endpoint.',
      };
    } catch {
      // fall through
    }

    return {
      item: null,
      source: 'api',
      warning: error instanceof Error ? error.message : 'Unable to load tournament detail.',
    };
  }
}

async function loadInvitedClubTournaments(clubId: string): Promise<ClubPublicProfile['activeTournaments']> {
  try {
    const envelope = await clubsApi.getClubTournaments(clubId, {
      scope: 'recent',
      limit: 100,
      offset: 0,
    });

    return envelope.items
      .filter((item) => item.canViewDetail)
      .map((item) => ({
        id: item.tournamentId,
        name: item.name,
        status: item.status as TournamentPublicProfile['status'],
        source:
          item.clubParticipationStatus === 'Participating'
            ? ('recent' as const)
            : ('invited' as const),
      }));
  } catch {
    return [];
  }
}

function mergeClubTournaments(
  current: ClubPublicProfile['activeTournaments'],
  invited: ClubPublicProfile['activeTournaments'],
) {
  const merged = [...current];

  invited.forEach((entry) => {
    if (!merged.some((item) => item.id === entry.id || item.name === entry.name)) {
      merged.push(entry);
    }
  });

  return merged;
}

export async function loadClubDetail(clubId: string): Promise<ClubDetailState> {
  try {
    const [item, invitedTournaments] = await Promise.all([
      publicApi.getPublicClubProfile(clubId),
      loadInvitedClubTournaments(clubId),
    ]);
    return {
      item: {
        ...item,
        activeTournaments: mergeClubTournaments(item.activeTournaments, invitedTournaments),
      },
      source: 'api',
    };
  } catch (error) {
    return {
      item: null,
      source: 'api',
      warning: error instanceof Error ? error.message : 'Unable to load club detail.',
    };
  }
}

export function buildFallbackTournamentStages(
  _tournamentId: string,
  profile: TournamentPublicProfile,
): NonNullable<TournamentPublicProfile['stages']> {
  if (profile.stages && profile.stages.length > 0) {
    return profile.stages;
  }

  if (profile.nextStageId) {
    return [
      {
        stageId: profile.nextStageId,
        name: profile.nextStageName || 'Current stage',
        status: profile.nextStageStatus,
        roundCount: 1,
        tableCount: 0,
        pendingTablePlanCount: 0,
      },
    ];
  }

  return [];
}
