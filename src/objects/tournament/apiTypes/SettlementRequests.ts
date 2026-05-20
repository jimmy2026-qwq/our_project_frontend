export interface SettlementAdjustmentRequest {
  playerId: string;
  label: string;
  amount: number;
  note?: string;
}

export interface SettleTournamentRequest {
  operatorId: string;
  finalStageId: string;
  prizePool?: number;
  payoutRatios?: number[];
  houseFeeAmount?: number;
  clubShareRatio?: number;
  adjustments?: SettlementAdjustmentRequest[];
  finalizeSettlement?: boolean;
  note?: string;
}

export interface FinalizeTournamentSettlementRequest {
  operatorId: string;
  note?: string;
}
