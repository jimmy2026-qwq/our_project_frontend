import { useCallback } from 'react';

import { OpsAnalyticsClubDashboardAPI, OpsAnalyticsPlayerDashboardAPI } from '@/api/opsanalytics';
import { sendAPI } from '@/system/api';

import { toDashboardSummary } from '../functions/toDashboardSummary';
import type { DashboardLoadState } from '../objects/state/DashboardLoadState';


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
        return { dashboard: toDashboardSummary(response) };
      } catch (error) {
        return {
          dashboard: null,
          warning:
            error instanceof Error
              ? error.message
              : '个人看板加载失败。',
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
        return { dashboard: toDashboardSummary(response) };
      } catch (error) {
        return {
          dashboard: null,
          warning:
            error instanceof Error
              ? error.message
              : '俱乐部看板加载失败。',
        };
      }
    },
    [],
  );

  return { loadClubDashboard, loadPlayerDashboard };
}
