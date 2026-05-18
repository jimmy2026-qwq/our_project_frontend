import type { ListEnvelope } from '@/objects';
import { toQueryString } from '@/lib/query';
import type { PlayerLeaderboardEntryContract } from './responses/publicquery.responses';
import { request } from '../shared/http';
import type { PlayerLeaderboardFilters } from './requests/publicquery.requests';

export const publicLeaderboardsApi = {
  getPublicPlayerLeaderboard(filters: PlayerLeaderboardFilters) {
    return request<ListEnvelope<PlayerLeaderboardEntryContract>>(
      `/public/leaderboards/players${toQueryString(filters)}`,
    );
  },
};
