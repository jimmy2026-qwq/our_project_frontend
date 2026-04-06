import { apiClient, type RawPlayerLeaderboardEntry } from '@/api/client';
import type {
  ClubSummary,
  PlayerLeaderboardEntry,
  PublicSchedule,
  TournamentPublicProfile,
} from '@/domain/models';
import {
  mockClubProfiles,
  mockClubs,
  mockLeaderboard,
  mockSchedules,
  mockTournamentProfiles,
  toMockEnvelope,
} from '@/mocks/overview';

import type {
  ClubDetailState,
  HomeDataPayload,
  LoadState,
  PublicHallState,
  TournamentDetailState,
} from './types';

function mapLeaderboardStatus(status: RawPlayerLeaderboardEntry['status']): PlayerLeaderboardEntry['status'] {
  return status === 'Suspended' ? 'Inactive' : status;
}

function formatRankLabel(rank?: RawPlayerLeaderboardEntry['currentRank']) {
  if (!rank) {
    return null;
  }

  return rank.stars ? `${rank.platform} ${rank.tier} ${rank.stars}` : `${rank.platform} ${rank.tier}`;
}

export const DEFAULT_PUBLIC_HALL_STATE: PublicHallState = {
  activeView: 'schedules',
  scheduleTournamentStatus: 'InProgress',
  scheduleStageStatus: 'Active',
  leaderboardClubId: '',
  leaderboardStatus: 'Active',
  clubActiveOnly: true,
};

const HOME_DATA_CACHE_TTL_MS = 15_000;

const homeDataCache = new Map<string, { payload: HomeDataPayload; cachedAt: number }>();
const homeDataRequests = new Map<string, Promise<HomeDataPayload>>();

function buildHomeDataKey(state: PublicHallState) {
  return JSON.stringify({
    scheduleTournamentStatus: state.scheduleTournamentStatus,
    scheduleStageStatus: state.scheduleStageStatus,
    leaderboardClubId: state.leaderboardClubId,
    leaderboardStatus: state.leaderboardStatus,
    clubActiveOnly: state.clubActiveOnly,
  });
}

export async function loadSchedules(state: PublicHallState): Promise<LoadState<PublicSchedule>> {
  try {
    const envelope = await apiClient.getPublicSchedules({
      tournamentStatus: state.scheduleTournamentStatus || undefined,
      stageStatus: state.scheduleStageStatus || undefined,
    });
    return { envelope, source: 'api' };
  } catch (error) {
    const items = mockSchedules.filter((item) => {
      const tournamentMatch =
        !state.scheduleTournamentStatus || item.tournamentStatus === state.scheduleTournamentStatus;
      const stageMatch = !state.scheduleStageStatus || item.stageStatus === state.scheduleStageStatus;
      return tournamentMatch && stageMatch;
    });

    return {
      envelope: toMockEnvelope(items, {
        tournamentStatus: state.scheduleTournamentStatus,
        stageStatus: state.scheduleStageStatus,
      }),
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Public schedules fallback to mock.',
    };
  }
}

export async function loadClubs(state: PublicHallState): Promise<LoadState<ClubSummary>> {
  try {
    const envelope = await apiClient.getPublicClubs();
    return { envelope, source: 'api' };
  } catch (error) {
    return {
      envelope: toMockEnvelope(mockClubs, { activeOnly: state.clubActiveOnly }),
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Club directory fallback to mock.',
    };
  }
}

export async function loadLeaderboard(
  state: PublicHallState,
  clubs: LoadState<ClubSummary>,
): Promise<LoadState<PlayerLeaderboardEntry>> {
  try {
    const envelope = await apiClient.getPublicPlayerLeaderboard({
      clubId: state.leaderboardClubId || undefined,
      status: state.leaderboardStatus || undefined,
    });

    const clubNamesById = new Map(clubs.envelope.items.map((club) => [club.id, club.name]));
    return {
      envelope: {
        ...envelope,
        items: envelope.items.map((item, index) => ({
          playerId: item.playerId,
          nickname: item.nickname,
          clubName: item.clubIds.map((clubId) => clubNamesById.get(clubId) ?? clubId).join(' / '),
          elo: item.elo,
          rank: index + 1 + envelope.offset,
          currentRank: formatRankLabel(item.currentRank),
          normalizedRankScore: item.normalizedRankScore,
          status: mapLeaderboardStatus(item.status),
        })),
      },
      source: 'api',
    };
  } catch (error) {
    const selectedClubName = mockClubs.find((club) => club.id === state.leaderboardClubId)?.name;
    const items = mockLeaderboard.filter((item) => {
      const clubMatch = !selectedClubName || item.clubName === selectedClubName;
      const statusMatch = !state.leaderboardStatus || item.status === state.leaderboardStatus;
      return clubMatch && statusMatch;
    });

    return {
      envelope: toMockEnvelope(items, {
        clubId: state.leaderboardClubId,
        status: state.leaderboardStatus,
      }),
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Player leaderboard fallback to mock.',
    };
  }
}

export async function loadPublicHallHomeData(state: PublicHallState): Promise<HomeDataPayload> {
  const cacheKey = buildHomeDataKey(state);
  const cached = homeDataCache.get(cacheKey);

  if (cached && Date.now() - cached.cachedAt < HOME_DATA_CACHE_TTL_MS) {
    return cached.payload;
  }

  const inFlightRequest = homeDataRequests.get(cacheKey);

  if (inFlightRequest) {
    return inFlightRequest;
  }

  const request = (async () => {
    const [schedules, clubs] = await Promise.all([loadSchedules(state), loadClubs(state)]);
    const leaderboard = await loadLeaderboard(state, clubs);
    const payload = { schedules, leaderboard, clubs };
    homeDataCache.set(cacheKey, { payload, cachedAt: Date.now() });
    return payload;
  })();

  homeDataRequests.set(cacheKey, request);

  try {
    return await request;
  } finally {
    homeDataRequests.delete(cacheKey);
  }
}

export async function loadTournamentDetail(tournamentId: string): Promise<TournamentDetailState> {
  try {
    const item = await apiClient.getPublicTournamentProfile(tournamentId);
    return { item, source: 'api' };
  } catch (error) {
    return {
      item: mockTournamentProfiles.find((profile) => profile.id === tournamentId) ?? null,
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Tournament detail fallback to mock.',
    };
  }
}

export async function loadClubDetail(clubId: string): Promise<ClubDetailState> {
  try {
    const item = await apiClient.getPublicClubProfile(clubId);
    return { item, source: 'api' };
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

  return mockSchedules
    .filter((item) => item.tournamentId === tournamentId)
    .map((item) => ({
      stageId: item.stageId,
      name: item.stageName,
      status: item.stageStatus,
      roundCount: 1,
      tableCount: 0,
      pendingTablePlanCount: 0,
    }));
}
