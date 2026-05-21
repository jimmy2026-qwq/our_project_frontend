import { OpsAnalyticsClubDashboardAPI } from '@/api/opsanalytics/OpsAnalyticsClubDashboardAPI';
import { OpsAnalyticsPlayerDashboardAPI } from '@/api/opsanalytics/OpsAnalyticsPlayerDashboardAPI';
import { mapDashboard } from '@/pages/objects/opsanalytics';
import { sendAPI } from '@/system/api';

import type { DashboardLoadState } from './data.shared';

export async function loadPlayerDashboard(
  playerId: string,
  operatorId: string,
): Promise<DashboardLoadState> {
  try {
    const response = await sendAPI(
      new OpsAnalyticsPlayerDashboardAPI({ playerId, operatorId }),
    );
    return { dashboard: mapDashboard(response), source: 'api' };
  } catch (error) {
    return {
      dashboard: null,
      source: 'api',
      warning:
        error instanceof Error
          ? error.message
          : 'Unable to load player dashboard.',
    };
  }
}

export async function loadClubDashboard(
  clubId: string,
  operatorId: string,
): Promise<DashboardLoadState> {
  try {
    const response = await sendAPI(
      new OpsAnalyticsClubDashboardAPI({ clubId, operatorId }),
    );
    return { dashboard: mapDashboard(response), source: 'api' };
  } catch (error) {
    return {
      dashboard: null,
      source: 'api',
      warning:
        error instanceof Error
          ? error.message
          : 'Unable to load club dashboard.',
    };
  }
}
