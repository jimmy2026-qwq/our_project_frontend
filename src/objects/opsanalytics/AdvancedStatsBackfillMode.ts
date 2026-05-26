export const AdvancedStatsBackfillModes = {
  Full: 'Full',
  Missing: 'Missing',
  Stale: 'Stale',
} as const;

export type AdvancedStatsBackfillMode =
  (typeof AdvancedStatsBackfillModes)[keyof typeof AdvancedStatsBackfillModes];
