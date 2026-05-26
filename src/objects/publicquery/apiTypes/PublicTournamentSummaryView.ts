import type { TournamentStatus } from '@/objects/tournament';

export interface PublicTournamentSummaryView {
  tournamentId: string;
  name: string;
  organizer: string;
  status: TournamentStatus;
  startsAt: string;
  endsAt: string;
  stageCount: number;
  activeStageCount: number;
  participantCount: number;
  clubCount: number;
  playerCount: number;
}
