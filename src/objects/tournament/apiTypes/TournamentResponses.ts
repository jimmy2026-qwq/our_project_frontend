import type { TournamentTableView } from './TableResponses';
import type {
  AdvancementRuleView,
  KnockoutRuleConfigView,
  PlayerStatus,
  RankPlatform,
  StageStatus,
  SwissRuleConfigView,
  TournamentFormat,
  TournamentParticipantKind,
  TournamentStatus,
} from './TournamentDomainTypes';

export interface TournamentStageSummaryView {
  stageId: string;
  name: string;
  format: TournamentFormat;
  order: number;
  status: StageStatus;
  currentRound: number;
  roundCount: number;
  schedulingPoolSize: number;
  pendingTablePlanCount: number;
  scheduledTableCount: number;
  advancementRule: AdvancementRuleView;
  swissRule: SwissRuleConfigView | null;
  knockoutRule: KnockoutRuleConfigView | null;
}

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

export interface TournamentLineupSubmissionView {
  submissionId: string;
  clubId: string;
  submittedBy: string;
  submittedAt: string;
  activePlayerIds: string[];
  reservePlayerIds: string[];
  note: string | null;
}

export interface TournamentParticipantClubView {
  clubId: string;
  memberCount: number;
}

export interface TournamentParticipantPlayerView {
  playerId: string;
  nickname: string;
  status: PlayerStatus;
  elo: number;
  currentRank: {
    platform: RankPlatform;
    tier: string;
    stars: number | null;
  };
  clubIds: string[];
}

export interface TournamentWhitelistSummaryView {
  totalEntries: number;
  clubCount: number;
  playerCount: number;
  clubIds: string[];
  playerIds: string[];
}

export interface TournamentStageDirectoryEntry {
  stageId: string;
  name: string;
  format: TournamentFormat;
  order: number;
  status: StageStatus;
  currentRound: number;
  roundCount: number;
  schedulingPoolSize: number;
  pendingTablePlanCount: number;
  scheduledTableCount: number;
}

export interface TournamentOperationsStageView {
  stageId: string;
  name: string;
  format: TournamentFormat;
  order: number;
  status: StageStatus;
  currentRound: number;
  roundCount: number;
  schedulingPoolSize: number;
  pendingTablePlanCount: number;
  scheduledTableCount: number;
  advancementRule: AdvancementRuleView;
  swissRule: SwissRuleConfigView | null;
  knockoutRule: KnockoutRuleConfigView | null;
  lineupSubmissions: TournamentLineupSubmissionView[];
}

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

export interface TournamentMutationView {
  tournament: TournamentDetailView;
  scheduledTables: TournamentTableView[];
}

export interface TournamentWhitelistEntryView {
  participantKind: TournamentParticipantKind;
  playerId: string | null;
  clubId: string | null;
}
