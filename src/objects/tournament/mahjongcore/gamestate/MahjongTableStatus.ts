export const MahjongTableStatuses = {
  NotStarted: 'NotStarted',
  InProgress: 'InProgress',
  WaitingPlayerAction: 'WaitingPlayerAction',
  WaitingCallDecision: 'WaitingCallDecision',
  RoundEnded: 'RoundEnded',
  Finished: 'Finished',
  Aborted: 'Aborted',
  Archived: 'Archived',
} as const;

export type MahjongTableStatus =
  (typeof MahjongTableStatuses)[keyof typeof MahjongTableStatuses];
