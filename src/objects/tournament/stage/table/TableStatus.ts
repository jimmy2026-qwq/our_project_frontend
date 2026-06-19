export const TableStatuses = {
  WaitingPreparation: 'WaitingPreparation',
  InProgress: 'InProgress',
  Scoring: 'Scoring',
  Archived: 'Archived',
  AppealInProgress: 'AppealInProgress',
} as const;

export type TableStatus = (typeof TableStatuses)[keyof typeof TableStatuses];
