import type { TournamentStatus } from '../TournamentStatus';
import type { TournamentStageSummaryView } from './TournamentStageSummaryView';

export interface TournamentSummaryView {
  tournamentId: string;
  name: string;
  organizer: string;
  startsAt: string;
  endsAt: string;
  status: TournamentStatus;
  participatingClubIds: string[];
  participatingPlayerIds: string[];
  adminIds: string[];
  whitelistCount: number;
  stages: TournamentStageSummaryView[];
}
