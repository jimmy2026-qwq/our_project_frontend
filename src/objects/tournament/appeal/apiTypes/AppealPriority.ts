export const AppealPriorities = {
  Low: 'Low',
  Normal: 'Normal',
  High: 'High',
  Critical: 'Critical',
} as const;

export type AppealPriority = (typeof AppealPriorities)[keyof typeof AppealPriorities];
