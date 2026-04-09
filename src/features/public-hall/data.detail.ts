import { publicApi } from '@/api/public';
import { operationsApi } from '@/api/operations';
import type { ClubPublicProfile, TournamentPublicProfile } from '@/domain/public';
import {
  mockClubProfiles,
  mockClubs,
  mockSchedules,
  mockTournamentProfiles,
} from '@/mocks/overview';

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
      // fall through to mock
    }

    return {
      item: mockTournamentProfiles.find((profile) => profile.id === tournamentId) ?? null,
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Tournament detail fallback to mock.',
    };
  }
}

async function loadInvitedClubTournaments(clubId: string): Promise<ClubPublicProfile['activeTournaments']> {
  try {
    const tournaments = await operationsApi.getTournaments({ limit: 100, offset: 0 });
    const details = await Promise.all(
      tournaments.items.map((tournament) => operationsApi.getTournament(tournament.id)),
    );

    return details
      .filter((tournament) => (tournament.participatingClubs ?? []).includes(clubId))
      .map((tournament) => ({
        id: tournament.id,
        name: tournament.name,
        status: tournament.status as TournamentPublicProfile['status'],
        source: 'invited' as const,
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
    const fallbackClub = mockClubs.find((club) => club.id === clubId);
    return {
      item:
        mockClubProfiles.find((profile) => profile.id === clubId) ??
        (fallbackClub
          ? {
              id: fallbackClub.id,
              name: fallbackClub.name,
              slogan: 'Public club profile',
              description:
                'Club detail fell back to the directory payload because the full public detail response was unavailable.',
              memberCount: fallbackClub.memberCount,
              powerRating: fallbackClub.powerRating,
              treasury: fallbackClub.treasury,
              relations: fallbackClub.relations,
              featuredPlayers: [],
              activeTournaments: [],
            }
          : null),
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Club detail fallback to mock.',
    };
  }
}

export function buildFallbackTournamentStages(
  tournamentId: string,
  profile: TournamentPublicProfile,
): NonNullable<TournamentPublicProfile['stages']> {
  if (profile.stages && profile.stages.length > 0) {
    return profile.stages;
  }

  const mockStages = mockSchedules
    .filter((item) => item.tournamentId === tournamentId)
    .map((item) => ({
      stageId: item.stageId,
      name: item.stageName,
      status: item.stageStatus,
      roundCount: 1,
      tableCount: 0,
      pendingTablePlanCount: 0,
    }));

  if (mockStages.length > 0) {
    return mockStages;
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
