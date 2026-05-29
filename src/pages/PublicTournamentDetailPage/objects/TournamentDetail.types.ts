import type { TournamentPublicProfile } from './PublicTournamentDetailPage.types';
import type { ClubSummary } from '@/pages/objects/ClubSummary';
import type { PlayerProfile } from '@/pages/objects/PlayerProfile';
import type { TournamentStageRuleDraft } from './TournamentDetailRule.types';

export interface TournamentDetailTableItem {
  id: string;
  stageId: string;
  stageName: string;
  tableCode: string;
  status: string;
  playerIds: string[];
}

export type TournamentHeaderStageAction = {
  kind: 'scheduleStage' | 'completeStage' | 'settleTournament';
  label: string;
  stageId: string;
} | null;

export interface TournamentDetailWorkbenchState {
  profile: TournamentPublicProfile;
  selectedClubId: string;
  isSubmittingTournamentAction: boolean;
  tournamentActionError: string;
  publishBlockedOpen: boolean;
  rulesDialogOpen: boolean;
  ruleDraft: TournamentStageRuleDraft;
  playerNames: Record<string, string>;
  showMoreInfo: boolean;
  canManageTournament: boolean;
  canPublishTournament: boolean;
  canScheduleStage: boolean;
  headerStageAction: TournamentHeaderStageAction;
  isWaitingForLineups: boolean;
  missingLineupClubNames: string[];
  submittedLineupClubIds: string[];
  lineupSubmissionCounts: Record<string, number>;
  invitedClubs: ClubSummary[];
  selectableClubs: ClubSummary[];
  participantPlayers: PlayerProfile[];
  selectablePlayers: PlayerProfile[];
  selectedPlayerId: string;
  visibleTables: TournamentDetailTableItem[];
}
