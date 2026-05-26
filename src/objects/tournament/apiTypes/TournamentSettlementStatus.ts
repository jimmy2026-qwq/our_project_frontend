export const TournamentSettlementStatuses = {
  Draft: 'Draft',
  Finalized: 'Finalized',
  Superseded: 'Superseded',
} as const;

export type TournamentSettlementStatus =
  (typeof TournamentSettlementStatuses)[keyof typeof TournamentSettlementStatuses];
