import { publicApi } from '@/api/public';
import type { ClubSummary, PlayerLeaderboardEntry } from '@/domain/public';

import type { LoadState, PublicHallState } from './types';
import { formatRankLabel, mapLeaderboardStatus } from './data.shared';

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

export async function loadLeaderboard(
  state: PublicHallState,
  clubs: LoadState<ClubSummary>,
): Promise<LoadState<PlayerLeaderboardEntry>> {
  try {
    const envelope = await publicApi.getPublicPlayerLeaderboard({
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
      warning: error instanceof Error ? error.message : 'Unable to load public leaderboard.',
    };
  }
}
