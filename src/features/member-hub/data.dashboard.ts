import { opsAnalyticsApi } from '@/api/opsanalytics';
import type { DashboardLoadState } from './data.shared';

export async function loadPlayerDashboard(
  playerId: string,
  operatorId: string,
): Promise<DashboardLoadState> {
  try {
    const dashboard = await opsAnalyticsApi.getPlayerDashboard(
      playerId,
      operatorId,
    );
    return { dashboard, source: 'api' };
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
    const dashboard = await opsAnalyticsApi.getClubDashboard(
      clubId,
      operatorId,
    );
    return { dashboard, source: 'api' };
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
