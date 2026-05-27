import { PublicPlayerLeaderboardAPI } from '@/api/publicquery';
import type { ClubSummary } from '@/pages/objects/club';
import { sendAPI } from '@/system/api';

import {
  formatRankLabel,
  mapLeaderboardStatus,
  mapLeaderboardStatusFilter,
  PUBLIC_HALL_CACHE_TTL_MS,
} from '../../objects/state';
import type {
  LeaderboardDataState,
  LoadState,
  PlayerLeaderboardEntry,
  PublicHallState,
} from '../../objects/types';

const leaderboardCache = new Map<
  string,
  { payload: LeaderboardDataState; cachedAt: number }
>();
const leaderboardRequests = new Map<string, Promise<LeaderboardDataState>>();

function buildLeaderboardKey(state: PublicHallState) {
  return JSON.stringify({
    leaderboardClubId: state.leaderboardClubId,
    leaderboardStatus: state.leaderboardStatus,
  });
}

function createEmptyLoadState<T>(): LoadState<T> {
  return {
    envelope: {
      items: [],
      total: 0,
      limit: 0,
      offset: 0,
      hasMore: false,
      appliedFilters: {},
    },
    source: 'api',
  };
}

function getCachedPublicHallLeaderboardData(state: PublicHallState) {
  const cacheKey = buildLeaderboardKey(state);
  const cached = leaderboardCache.get(cacheKey);

  if (!cached || Date.now() - cached.cachedAt >= PUBLIC_HALL_CACHE_TTL_MS) {
    return null;
  }

  return cached.payload;
}

export function peekPublicHallLeaderboardData(state: PublicHallState) {
  return leaderboardCache.get(buildLeaderboardKey(state))?.payload ?? null;
}

async function loadLeaderboard(
  state: PublicHallState,
  clubs: LoadState<ClubSummary>,
): Promise<LoadState<PlayerLeaderboardEntry>> {
  try {
    const envelope = await sendAPI(
      new PublicPlayerLeaderboardAPI({
        clubId: state.leaderboardClubId || undefined,
        status: mapLeaderboardStatusFilter(state.leaderboardStatus),
      }),
    );

    const clubNamesById = new Map(
      clubs.envelope.items.map((club) => [club.id, club.name]),
    );
    return {
      envelope: {
        ...envelope,
        items: envelope.items.map((item, index) => ({
          playerId: item.playerId,
          nickname: item.nickname,
          clubName: item.clubIds
            .map((clubId) => clubNamesById.get(clubId) ?? clubId)
            .join(' / '),
          clubIds: item.clubIds,
          elo: item.elo,
          rank: index + 1 + envelope.offset,
          currentRank: formatRankLabel(item.currentRank),
          currentRankSnapshot: item.currentRank ?? null,
          normalizedRankScore: item.normalizedRankScore,
          status: mapLeaderboardStatus(item.status),
        })),
      },
      source: 'api',
    };
  } catch (error) {
    return {
      ...createEmptyLoadState<PlayerLeaderboardEntry>(),
      warning:
        error instanceof Error
          ? error.message
          : 'Unable to load public leaderboard.',
    };
  }
}

export async function loadPublicHallLeaderboardData(
  state: PublicHallState,
  clubs: LoadState<ClubSummary>,
): Promise<LeaderboardDataState> {
  const cacheKey = buildLeaderboardKey(state);
  const cached = getCachedPublicHallLeaderboardData(state);

  if (cached) {
    return cached;
  }

  const inFlightRequest = leaderboardRequests.get(cacheKey);

  if (inFlightRequest) {
    return inFlightRequest;
  }

  const request = (async () => {
    const leaderboard = await loadLeaderboard(state, clubs);
    const payload = { leaderboard };
    leaderboardCache.set(cacheKey, { payload, cachedAt: Date.now() });
    return payload;
  })();

  leaderboardRequests.set(cacheKey, request);

  try {
    return await request;
  } finally {
    leaderboardRequests.delete(cacheKey);
  }
}
