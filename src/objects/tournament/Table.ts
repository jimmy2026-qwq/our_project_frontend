import type { TableSeat } from './TableSeat';
import type { TableStatus } from './TableStatus';

export interface Table {
  id: string;
  tableNo: number;
  tournamentId: string;
  stageId: string;
  seats: TableSeat[];
  stageRoundNumber: number;
  bracketMatchId: string | null;
  bracketRoundNumber: number | null;
  feederMatchIds: string[];
  status: TableStatus;
  startedAt: string | null;
  scoringStartedAt: string | null;
  endedAt: string | null;
  paifuId: string | null;
  matchRecordId: string | null;
  appealTicketIds: string[];
  resetCount: number;
  operatorNotes: string[];
  version: number;
}
