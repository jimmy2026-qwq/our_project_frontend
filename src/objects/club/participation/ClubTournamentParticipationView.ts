import type { TournamentStatus } from '@/objects/tournament';
import type { ClubTournamentParticipationStatus } from './ClubTournamentParticipationStatus';

export interface ClubTournamentParticipationView {
  clubId: string;
  tournamentId: string;
  name: string;
  status: TournamentStatus;
  clubParticipationStatus: ClubTournamentParticipationStatus;
  stageName: string | null;
  startsAt: string;
  endsAt: string;
  canViewDetail: boolean;
  canSubmitLineup: boolean;
  canDecline: boolean;
}
