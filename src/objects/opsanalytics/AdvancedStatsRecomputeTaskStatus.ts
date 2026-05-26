export const AdvancedStatsRecomputeTaskStatuses = {
  Pending: 'Pending',
  Processing: 'Processing',
  Completed: 'Completed',
  Failed: 'Failed',
  DeadLetter: 'DeadLetter',
} as const;

export type AdvancedStatsRecomputeTaskStatus =
  (typeof AdvancedStatsRecomputeTaskStatuses)[keyof typeof AdvancedStatsRecomputeTaskStatuses];
