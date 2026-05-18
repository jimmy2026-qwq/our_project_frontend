import type { ListEnvelope } from '@/objects';
import type { PlayerLeaderboardEntryContract, PlayerLeaderboardFilters } from '@/objects/publicquery';
import { toQueryString } from '@/lib/query';
import { request } from '../shared/http';

export const publicLeaderboardsApi = {
  getPublicPlayerLeaderboard(filters: PlayerLeaderboardFilters) {
    return request<ListEnvelope<PlayerLeaderboardEntryContract>>(
      `/public/leaderboards/players${toQueryString(filters)}`,
    );
  },
};
