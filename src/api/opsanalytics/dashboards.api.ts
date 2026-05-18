import { toQueryString } from '@/lib/query';
import type { DashboardContract } from '@/objects/opsanalytics';
import { request } from '../shared/http';
import { mapDashboard } from './mappers';

export const opsAnalyticsDashboardsApi = {
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
