import type { DashboardOwner } from './DashboardOwner';

export interface Dashboard {
  owner: DashboardOwner;
  sampleSize: number;
  dealInRate: number;
  winRate: number;
  averageWinPoints: number;
  riichiRate: number;
  averagePlacement: number;
  topFinishRate: number;
  lastUpdatedAt: string;
  version: number;
}
