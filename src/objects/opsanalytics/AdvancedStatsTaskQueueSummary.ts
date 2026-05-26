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
