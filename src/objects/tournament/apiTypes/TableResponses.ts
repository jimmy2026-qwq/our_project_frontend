import type { TableStatus } from './TournamentDomainTypes';
import type { SeatWind } from './TournamentDomainTypes';

export interface TournamentTableSeatView {
  seat: SeatWind;
  playerId: string;
  initialPoints: number;
  disconnected: boolean;
  ready: boolean;
  clubId: string | null;
}

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
