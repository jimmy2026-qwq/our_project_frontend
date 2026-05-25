export type DashboardOwner = `player:${string}` | `club:${string}`;

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

export type AdvancedStatsRecomputeTaskStatus =
  | 'Pending'
  | 'Processing'
  | 'Completed'
  | 'Failed'
  | 'DeadLetter';

export type AdvancedStatsBackfillMode = 'Full' | 'Missing' | 'Stale';

export interface AdvancedStatsRecomputeTask {
  id: string;
  owner: DashboardOwner;
  reason: string;
  calculatorVersion: number;
  requestedAt: string;
  status: AdvancedStatsRecomputeTaskStatus;
  attempts: number;
  lastError: string | null;
  lastMatchRecordId: string | null;
  nextAttemptAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  deadLetteredAt: string | null;
  version: number;
}

export interface AdvancedStatsTaskQueueSummary {
  asOf: string;
  runnablePendingCount: number;
  scheduledRetryCount: number;
  processingCount: number;
  completedCount: number;
  failedCount: number;
  deadLetterCount: number;
  oldestRunnableRequestedAt: string | null;
  nextScheduledRetryAt: string | null;
  newestCompletedAt: string | null;
}
