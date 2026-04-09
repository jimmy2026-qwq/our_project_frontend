import { publicApi } from '@/api/public';

import { findMockDashboard, type DashboardLoadState } from './data.shared';

export async function loadPlayerDashboard(playerId: string, operatorId: string): Promise<DashboardLoadState> {
  try {
    const dashboard = await publicApi.getPlayerDashboard(playerId, operatorId);
    return { dashboard, source: 'api' };
  } catch (error) {
    return {
      dashboard: findMockDashboard(playerId),
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Player dashboard fallback to mock.',
    };
  }
}

export async function loadClubDashboard(clubId: string, operatorId: string): Promise<DashboardLoadState> {
  try {
    const dashboard = await publicApi.getClubDashboard(clubId, operatorId);
    return { dashboard, source: 'api' };
  } catch (error) {
    return {
      dashboard: findMockDashboard(clubId),
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Club dashboard fallback to mock.',
    };
  }
}
