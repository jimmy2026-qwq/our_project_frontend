import type { TournamentStatus } from '@/objects/tournament';

export interface PublicTournamentQuery {
  status?: TournamentStatus;
  organizer?: string;
  limit?: number;
  offset?: number;
}
