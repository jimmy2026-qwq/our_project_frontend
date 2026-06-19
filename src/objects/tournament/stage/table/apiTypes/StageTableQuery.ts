import type { TableStatus } from '../TableStatus';

export interface StageTableQuery {
  status?: TableStatus;
  roundNumber?: number;
  playerId?: string;
  limit?: number;
  offset?: number;
}
