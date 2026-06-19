import type { RoundSettlementNote } from './RoundSettlementNote';

export interface RoundSettlement {
  riichiSticksDelta: number;
  honbaPayment: number;
  notes: RoundSettlementNote[];
}
