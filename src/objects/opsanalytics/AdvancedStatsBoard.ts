import type { DashboardOwner } from './DashboardOwner';

export interface AdvancedStatsBoard {
  owner: DashboardOwner;
  sampleSize: number;
  defenseStability: number;
  ukeireExpectation: number;
  averageShantenImprovement: number;
  callAggressionRate: number;
  riichiConversionRate: number;
  pressureDefenseRate: number;
  postRiichiFoldRate: number;
  shantenTrajectory: number[];
  calculatorVersion: number;
  strictRoundSampleSize: number;
  exactUkeireSampleRate: number;
  exactDefenseSampleRate: number;
  lastUpdatedAt: string;
  version: number;
}
