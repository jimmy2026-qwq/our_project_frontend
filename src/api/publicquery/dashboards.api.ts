import { toQueryString } from '@/lib/query';
import type { DashboardContract } from './responses/publicquery.responses';
import { mapDashboard } from './mappers';
import { request } from '../shared/http';

export const publicDashboardsApi = {
  getPlayerDashboard(playerId: string, operatorId: string) {
    return request<DashboardContract>(
      `/dashboards/players/${playerId}${toQueryString({ operatorId })}`,
    ).then(mapDashboard);
  },
  getClubDashboard(clubId: string, operatorId: string) {
    return request<DashboardContract>(
      `/dashboards/clubs/${clubId}${toQueryString({ operatorId })}`,
    ).then(mapDashboard);
  },
};
