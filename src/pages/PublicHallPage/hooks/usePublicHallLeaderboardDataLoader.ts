import { useCallback } from 'react';

import { PublicPlayerLeaderboardAPI } from '@/api/player';
import type { ClubSummary } from '@/pages/shared_objects/club/ClubSummary';
import { sendAPI } from '@/system/api';

import { buildLeaderboardKey, deleteLeaderboardDataRequest, getCachedPublicHallLeaderboardData, getLeaderboardDataRequest, setCachedPublicHallLeaderboardData, setLeaderboardDataRequest } from '../functions/getPublicHallLeaderboardDataCache';
import { formatRankLabel } from '../functions/formatRankLabel';
import { toLeaderboardStatus, toLeaderboardStatusFilter } from '../functions/toPublicHallData';
import type { LeaderboardDataState } from '../objects/state/LeaderboardDataState';
import { LoadState } from '../objects/state/LoadState';
import { PlayerLeaderboardEntry } from '../objects/leaderboard/PlayerLeaderboardEntry';
import { PublicHallState } from '../objects/state/PublicHallState';

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
  };
}

async function loadLeaderboard(
  state: PublicHallState,
  clubs: LoadState<ClubSummary>,
): Promise<LoadState<PlayerLeaderboardEntry>> {
  try {
    const envelope = await sendAPI(
      new PublicPlayerLeaderboardAPI({
        clubId: state.leaderboardClubId || undefined,
        status: toLeaderboardStatusFilter(state.leaderboardStatus),
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
          status: toLeaderboardStatus(item.status),
        })),
      },
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

export function usePublicHallLeaderboardDataLoader() {
  return useCallback(
    async (
      state: PublicHallState,
      clubs: LoadState<ClubSummary>,
    ): Promise<LeaderboardDataState> => {
      const cacheKey = buildLeaderboardKey(state);
      const cached = getCachedPublicHallLeaderboardData(state);

      if (cached) {
        return cached;
      }

      const inFlightRequest = getLeaderboardDataRequest(cacheKey);

      if (inFlightRequest) {
        return inFlightRequest;
      }

      const request = (async () => {
        const leaderboard = await loadLeaderboard(state, clubs);
        const payload = { leaderboard };
        setCachedPublicHallLeaderboardData(cacheKey, payload);
        return payload;
      })();

      setLeaderboardDataRequest(cacheKey, request);

      try {
        return await request;
      } finally {
        deleteLeaderboardDataRequest(cacheKey);
      }
    },
    [],
  );
}
