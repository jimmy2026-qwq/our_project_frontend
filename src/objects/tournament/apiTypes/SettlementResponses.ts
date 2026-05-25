export type TournamentSettlementStatus = 'Draft' | 'Finalized' | 'Superseded';

export interface TournamentSettlementAdjustmentView {
  playerId: string;
  label: string;
  amount: number;
  note: string | null;
}

export interface TournamentSettlementEntryView {
  playerId: string;
  rank: number;
  awardAmount: number;
  baseAwardAmount: number;
  adjustmentAmount: number;
  deductionAmount: number;
  clubId: string | null;
  clubShareAmount: number;
  playerRetainedAmount: number;
  finalPoints: number;
  champion: boolean;
}

export interface TournamentSettlementView {
  settlementId: string;
  tournamentId: string;
  stageId: string;
  revision: number;
  status: TournamentSettlementStatus;
  generatedAt: string;
  finalizedAt: string | null;
  supersededAt: string | null;
  supersedesSettlementId: string | null;
  championId: string;
  prizePool: number;
  houseFeeAmount: number;
  netPrizePool: number;
  clubShareRatio: number;
  adjustments: TournamentSettlementAdjustmentView[];
  entries: TournamentSettlementEntryView[];
  summary: string;
}
