import { publicApi } from '@/pages/PublicHall/objects/data.transport';
import { clubsApi } from '@/pages/PublicHall/objects/data.transport';
import { tournamentApi } from '@/pages/PublicHall/objects/data.transport';
import type {
  ClubPublicProfile,
  TournamentPublicProfile,
} from '@/pages/PublicHall/objects';

import type { ClubDetailState, TournamentDetailState } from './types';
import { mapTournamentDetailFromAdminView } from './data.shared';

export async function loadTournamentDetail(
  tournamentId: string,
): Promise<TournamentDetailState> {
  try {
    const item = await publicApi.getPublicTournamentProfile(tournamentId);
    return { item, source: 'api' };
  } catch (error) {
    try {
      const draftItem = await tournamentApi.getTournament(tournamentId);
      return {
        item: mapTournamentDetailFromAdminView(draftItem),
        source: 'api',
        warning:
          'This tournament is still in draft mode and is shown through the admin endpoint.',
      };
    } catch {
      // fall through
    }

    return {
      item: null,
      source: 'api',
      warning:
        error instanceof Error
          ? error.message
          : 'Unable to load tournament detail.',
    };
  }
}

async function loadClubTournaments(
  clubId: string,
  viewerId?: string,
): Promise<ClubPublicProfile['activeTournaments']> {
  try {
    const envelope = await clubsApi.getClubTournaments(clubId, {
      scope: 'all',
      viewer: viewerId,
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
        canSubmitLineup: item.canSubmitLineup,
      }));
  } catch {
    return [];
  }
}

export async function loadClubDetail(
  clubId: string,
  viewerId?: string,
): Promise<ClubDetailState> {
  try {
    const [item, activeTournaments] = await Promise.all([
      publicApi.getPublicClubProfile(clubId),
      loadClubTournaments(clubId, viewerId),
    ]);
    return {
      item: {
        ...item,
        activeTournaments,
      },
      source: 'api',
    };
  } catch (error) {
    return {
      item: null,
      source: 'api',
      warning:
        error instanceof Error ? error.message : 'Unable to load club detail.',
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
