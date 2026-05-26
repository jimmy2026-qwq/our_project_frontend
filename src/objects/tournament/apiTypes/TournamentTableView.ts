import type { TableStatus } from '../TableStatus';
import type { TournamentTableSeatView } from './TournamentTableSeatView';

export interface TournamentTableView {
  tableId: string;
  tournamentId: string;
  stageId: string;
  tableNo: number;
  seats: TournamentTableSeatView[];
  stageRoundNumber: number;
  bracketMatchId: string | null;
  bracketRoundNumber: number | null;
  status: TableStatus;
  startedAt: string | null;
  scoringStartedAt: string | null;
  endedAt: string | null;
  paifuId: string | null;
  matchRecordId: string | null;
  appealTicketIds: string[];
  resetCount: number;
}

