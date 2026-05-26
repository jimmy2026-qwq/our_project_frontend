export const StageStatuses = {
  Pending: 'Pending',
  Ready: 'Ready',
  Active: 'Active',
  Completed: 'Completed',
  Archived: 'Archived',
} as const;

export type StageStatus = (typeof StageStatuses)[keyof typeof StageStatuses];
