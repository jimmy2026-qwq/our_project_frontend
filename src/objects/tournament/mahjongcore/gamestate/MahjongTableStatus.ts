export type MahjongTableStatus =
  | 'NotStarted'
  | 'InProgress'
  | 'WaitingPlayerAction'
  | 'WaitingCallDecision'
  | 'RoundEnded'
  | 'Finished'
  | 'Aborted'
  | 'Archived';
