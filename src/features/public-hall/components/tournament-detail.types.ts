import type {
  ClubSummary,
  TournamentPublicProfile,
} from '@/features/public-hall/objects';

export interface TournamentDetailTableItem {
  id: string;
  stageId: string;
  stageName: string;
  tableCode: string;
  status: string;
  playerIds: string[];
}

export interface TournamentDetailWorkbenchState {
  profile: TournamentPublicProfile;
  selectedClubId: string;
  isSubmittingTournamentAction: boolean;
  tournamentActionError: string;
  publishBlockedOpen: boolean;
  playerNames: Record<string, string>;
  showMoreInfo: boolean;
  canManageTournament: boolean;
  canPublishTournament: boolean;
  canScheduleStage: boolean;
  isWaitingForLineups: boolean;
  missingLineupClubNames: string[];
  submittedLineupClubIds: string[];
  lineupSubmissionCounts: Record<string, number>;
  invitedClubs: ClubSummary[];
  selectableClubs: ClubSummary[];
  visibleTables: TournamentDetailTableItem[];
}
