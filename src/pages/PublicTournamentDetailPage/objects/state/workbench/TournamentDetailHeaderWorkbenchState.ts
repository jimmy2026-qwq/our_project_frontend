import type { TournamentHeaderStageAction } from '@/pages/PublicTournamentDetailPage/objects/stage/TournamentHeaderStageAction';

export interface TournamentDetailHeaderWorkbenchState {
  canPublishTournament: boolean;
  canScheduleStage: boolean;
  headerStageAction: TournamentHeaderStageAction;
  isWaitingForLineups: boolean;
  missingLineupClubNames: string[];
}
