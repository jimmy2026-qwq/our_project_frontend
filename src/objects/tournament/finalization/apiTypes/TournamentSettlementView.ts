import type { TournamentSettlementAdjustment } from '../TournamentSettlementAdjustment';
import type { TournamentSettlementEntry } from '../TournamentSettlementEntry';
import type { TournamentSettlementStatus } from '../TournamentSettlementStatus';

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
  adjustments: TournamentSettlementAdjustment[];
  entries: TournamentSettlementEntry[];
  summary: string;
}
