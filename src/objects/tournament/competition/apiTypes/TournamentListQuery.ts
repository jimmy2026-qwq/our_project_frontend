import type { TournamentStatus } from '../TournamentStatus';

export interface TournamentListQuery {
  status?: TournamentStatus;
  adminId?: string;
  organizer?: string;
  limit?: number;
  offset?: number;
}
