import { mapDashboard } from '@/pages/objects/OpsAnalyticsMappers';
import { sendAPI } from '@/system/api';

import { OpsAnalyticsClubDashboardAPI } from '@/api/opsanalytics/OpsAnalyticsClubDashboardAPI';
import { OpsAnalyticsPlayerDashboardAPI } from '@/api/opsanalytics/OpsAnalyticsPlayerDashboardAPI';


export const opsAnalyticsApi = {
  getPlayerDashboard(playerId: string, operatorId: string) {
    return sendAPI(
      new OpsAnalyticsPlayerDashboardAPI({ playerId, operatorId }),
    ).then(mapDashboard);
  },
  getClubDashboard(clubId: string, operatorId: string) {
    return sendAPI(new OpsAnalyticsClubDashboardAPI({ clubId, operatorId }))
      .then(mapDashboard);
  },
};
