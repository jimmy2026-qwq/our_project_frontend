import type { TournamentTableView } from './TableResponses';

export interface TournamentStageSummaryView {
  stageId: string;
  name: string;
  format: string;
  order: number;
  status: string;
  currentRound: number;
  roundCount: number;
  schedulingPoolSize: number;
  pendingTablePlanCount: number;
  scheduledTableCount: number;
}

export interface TournamentSummaryView {
  tournamentId: string;
  name: string;
  organizer: string;
  startsAt: string;
  endsAt: string;
  status: string;
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
  note?: string | null;
}

export interface TournamentParticipantClubView {
  clubId: string;
  memberCount: number;
}

export interface TournamentParticipantPlayerView {
  playerId: string;
  nickname: string;
  status: string;
  elo: number;
  currentRank: {
    platform: string;
    tier: string;
    stars?: number | null;
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
  format: string;
  order: number;
  status: string;
  currentRound: number;
  roundCount: number;
  schedulingPoolSize: number;
  pendingTablePlanCount: number;
  scheduledTableCount: number;
}

export interface TournamentOperationsStageView {
  stageId: string;
  name: string;
  status: string;
  format?: string;
  order?: number;
  currentRound?: number;
  roundCount?: number;
  schedulingPoolSize?: number;
  pendingTablePlanCount?: number;
  scheduledTableCount?: number;
  lineupSubmissions?: TournamentLineupSubmissionView[];
}

export interface TournamentDetailView {
  tournamentId: string;
  name: string;
  organizer: string;
  status: string;
  startsAt: string;
  endsAt: string;
  participatingClubs?: TournamentParticipantClubView[];
  participatingPlayers?: Array<{ playerId: string }>;
  whitelistSummary?: TournamentWhitelistSummaryView;
  stages?: TournamentOperationsStageView[];
}

export interface TournamentMutationView {
  tournament: TournamentDetailView;
  scheduledTables: TournamentTableView[];
}

export interface TournamentWhitelistEntryView {
  participantKind: string;
  playerId?: string | null;
  clubId?: string | null;
}
