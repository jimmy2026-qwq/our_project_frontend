export type DashboardOwnerContract = `player:${string}` | `club:${string}`;

export interface DashboardContract {
  owner: DashboardOwnerContract;
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
