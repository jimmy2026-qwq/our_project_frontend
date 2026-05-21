import type { TableStatus } from './TournamentDomainTypes';
import type { SeatWind } from './TournamentDomainTypes';

export interface TournamentTableSeatView {
  seat: SeatWind;
  playerId: string;
  initialPoints?: number;
  disconnected?: boolean;
  ready?: boolean;
  clubId?: string | null;
}

export interface TournamentTableView {
  tableId?: string;
  id: string;
  tournamentId?: string;
  stageId: string;
  tableNo: number;
  status?: TableStatus;
  seats?: TournamentTableSeatView[];
}
