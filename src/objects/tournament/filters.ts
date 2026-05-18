import type { TableStatus } from '../shared/common';

export interface TournamentFilters {
  status?: string;
  adminId?: string;
  organizer?: string;
  limit?: number;
  offset?: number;
}

export interface TableFilters {
  status?: TableStatus;
  playerId?: string;
  limit?: number;
  offset?: number;
}

export interface RecordFilters {
  tournamentId?: string;
  stageId?: string;
  playerId?: string;
  limit?: number;
  offset?: number;
}
