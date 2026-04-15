import { publicApi } from '@/api/public';
import type { DashboardLoadState } from './data.shared';

export async function loadPlayerDashboard(playerId: string, operatorId: string): Promise<DashboardLoadState> {
  try {
    const dashboard = await publicApi.getPlayerDashboard(playerId, operatorId);
    return { dashboard, source: 'api' };
  } catch (error) {
    return {
      dashboard: null,
      source: 'api',
      warning: error instanceof Error ? error.message : 'Unable to load player dashboard.',
    };
  }
}

export async function loadClubDashboard(clubId: string, operatorId: string): Promise<DashboardLoadState> {
  try {
    const dashboard = await publicApi.getClubDashboard(clubId, operatorId);
    return { dashboard, source: 'api' };
  } catch (error) {
    return {
      dashboard: null,
      source: 'api',
      warning: error instanceof Error ? error.message : 'Unable to load club dashboard.',
    };
  }
}
