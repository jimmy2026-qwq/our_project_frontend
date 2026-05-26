import type { TournamentStatus } from '@/objects/tournament';
import type { PublicTournamentStageView } from './PublicTournamentStageView';

export interface PublicTournamentDetailView {
  tournamentId: string;
  name: string;
  organizer: string;
  status: TournamentStatus;
  startsAt: string;
  endsAt: string;
  clubIds: string[];
  playerIds: string[];
  whitelistCount: number;
  stages: PublicTournamentStageView[];
}
