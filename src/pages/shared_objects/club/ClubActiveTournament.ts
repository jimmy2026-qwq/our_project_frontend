import type { TournamentStatus } from '@/objects';
import type { ClubTournamentSource } from './ClubTournamentSource';

export interface ClubActiveTournament {
  id: string;
  name: string;
  status?: TournamentStatus;
  source?: ClubTournamentSource;
  participationStatus?: 'Invited' | 'Participating';
  canSubmitLineup?: boolean;
  canDecline?: boolean;
}
