import type { ClubSummary, TournamentPublicProfile } from '@/domain/public';

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
  publishBlockedOpen: boolean;
  playerNames: Record<string, string>;
  showMoreInfo: boolean;
  canManageTournament: boolean;
  canPublishTournament: boolean;
  canScheduleStage: boolean;
  invitedClubs: ClubSummary[];
  selectableClubs: ClubSummary[];
  visibleTables: TournamentDetailTableItem[];
}
