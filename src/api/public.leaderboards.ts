import type { ListEnvelope } from '@/domain';
import { toQueryString } from '@/lib/query';
import type { PlayerLeaderboardEntryContract } from './contracts/public';
import { request } from './http';
import type { PlayerLeaderboardFilters } from './public.shared';

export const publicLeaderboardsApi = {
  getPublicPlayerLeaderboard(filters: PlayerLeaderboardFilters) {
    return request<ListEnvelope<PlayerLeaderboardEntryContract>>(
      `/public/leaderboards/players${toQueryString(filters)}`,
    );
  },
};
