import type { TournamentStatus } from '../TournamentStatus';
import type { TournamentOperationsStageView } from './TournamentOperationsStageView';
import type { TournamentParticipantClubView } from './TournamentParticipantClubView';
import type { TournamentParticipantPlayerView } from './TournamentParticipantPlayerView';
import type { TournamentWhitelistSummaryView } from './TournamentWhitelistSummaryView';

export interface TournamentDetailView {
  tournamentId: string;
  name: string;
  organizer: string;
  status: TournamentStatus;
  startsAt: string;
  endsAt: string;
  participatingClubs: TournamentParticipantClubView[];
  participatingPlayers: TournamentParticipantPlayerView[];
  whitelistSummary: TournamentWhitelistSummaryView;
  stages: TournamentOperationsStageView[];
}
