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

