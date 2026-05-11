import { toQueryString } from '@/lib/query';
import type { DashboardContract } from './contracts/public';
import { mapDashboard } from './public.mappers';
import { request } from './http';

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
