import type { SettlementAdjustmentRequest } from './SettlementAdjustmentRequest';

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

