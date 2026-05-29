import { useCallback } from 'react';

import { OpsAnalyticsClubDashboardAPI } from '@/api/opsanalytics/OpsAnalyticsClubDashboardAPI';
import { OpsAnalyticsPlayerDashboardAPI } from '@/api/opsanalytics/OpsAnalyticsPlayerDashboardAPI';
import { sendAPI } from '@/system/api';

import { toDashboardSummary } from '../functions/toDashboardSummary';
import type { DashboardLoadState } from '../objects/MemberHub.types';

export function useMemberHubDashboardLoader() {
  const loadPlayerDashboard = useCallback(
    async (
      playerId: string,
      operatorId: string,
    ): Promise<DashboardLoadState> => {
      try {
        const response = await sendAPI(
          new OpsAnalyticsPlayerDashboardAPI({ playerId, operatorId }),
        );
        return { dashboard: toDashboardSummary(response), source: 'api' };
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
    },
    [],
  );

  const loadClubDashboard = useCallback(
    async (clubId: string, operatorId: string): Promise<DashboardLoadState> => {
      try {
        const response = await sendAPI(
          new OpsAnalyticsClubDashboardAPI({ clubId, operatorId }),
        );
        return { dashboard: toDashboardSummary(response), source: 'api' };
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
    },
    [],
  );

  return { loadClubDashboard, loadPlayerDashboard };
}
