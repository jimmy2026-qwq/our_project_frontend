export const MahjongRoundPhases = {
  InitialDeal: 'InitialDeal',
  PlayerTurn: 'PlayerTurn',
  CallDecision: 'CallDecision',
  WinDecision: 'WinDecision',
  Settlement: 'Settlement',
  Finished: 'Finished',
} as const;

export type MahjongRoundPhase =
  (typeof MahjongRoundPhases)[keyof typeof MahjongRoundPhases];
