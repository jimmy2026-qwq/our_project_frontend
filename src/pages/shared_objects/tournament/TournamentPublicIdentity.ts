import type { TournamentStatus } from '@/objects';

export interface TournamentPublicIdentity {
  id: string;
  name: string;
  organizer?: string;
  status: TournamentStatus;
  tagline: string;
  description: string;
  venue: string;
}
