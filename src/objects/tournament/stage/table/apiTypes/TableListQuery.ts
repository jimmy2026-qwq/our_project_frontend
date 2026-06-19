import type { TableStatus } from '../TableStatus';

export interface TableListQuery {
  status?: TableStatus;
  tournamentId?: string;
  stageId?: string;
  roundNumber?: number;
  playerId?: string;
  limit?: number;
  offset?: number;
}
