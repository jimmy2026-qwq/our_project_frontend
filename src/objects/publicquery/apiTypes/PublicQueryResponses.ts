import type {
  AdvancementRuleView,
  KnockoutBracketSnapshot,
  KnockoutRuleConfigView,
  RankPlatform,
  SeatWind,
  StageRankingSnapshot,
  StageStatus,
  SwissRuleConfigView,
  TournamentFormat,
  TournamentStatus,
} from '@/objects/tournament';

type PlayerStatus = 'Active' | 'Suspended' | 'Banned';

export interface PublicScheduleView {
  tournamentId: string;
  tournamentName: string;
  tournamentStatus: TournamentStatus;
  stageId: string;
  stageName: string;
  stageStatus: StageStatus;
  currentRound: number;
  roundCount: number;
  startsAt: string;
  endsAt: string;
  tableCount: number;
  activeTableCount: number;
  pendingTablePlanCount: number;
  participantCount: number;
  whitelistCount: number;
}

export interface PublicTournamentStageView {
  stageId: string;
  name: string;
  format: TournamentFormat;
  order: number;
  status: StageStatus;
  currentRound: number;
  roundCount: number;
  schedulingPoolSize: number;
  tableCount: number;
  archivedTableCount: number;
  pendingTablePlanCount: number;
  standings: StageRankingSnapshot | null;
  bracket: KnockoutBracketSnapshot | null;
  advancementRule: AdvancementRuleView;
  swissRule: SwissRuleConfigView | null;
  knockoutRule: KnockoutRuleConfigView | null;
}

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

export interface PublicClubRelationView {
  relation: 'Alliance' | 'Rivalry' | 'Neutral';
}

export interface PublicClubDirectoryEntry {
  clubId: string;
  name: string;
  memberCount: number;
  activeMemberCount: number;
  adminCount: number;
  powerRating: number;
  totalPoints: number;
  treasuryBalance: number;
  pointPool: number;
  allianceCount: number;
  rivalryCount: number;
  strongestRivalClubId: string | null;
  strongestRivalPower: number | null;
  honorTitles: string[];
  relations: PublicClubRelationView[];
}

export interface PublicClubHonorView {
  title: string;
}

export interface PublicClubLineupMemberView {
  playerId: string;
  nickname: string;
  elo: number;
  currentRank: RankSnapshotView;
  status: PlayerStatus;
  isAdmin: boolean;
  internalTitle: string | null;
  privileges: string[];
}

export interface PublicClubRecentMatchSeatView {
  playerId: string;
  nickname: string;
  clubId: string | null;
  seat: SeatWind;
  placement: number;
  scoreDelta: number;
  finalPoints: number;
}

export interface PublicClubRecentMatchView {
  matchRecordId: string;
  tournamentId: string;
  tournamentName: string;
  stageId: string;
  stageName: string;
  tableId: string;
  generatedAt: string;
  seats: PublicClubRecentMatchSeatView[];
}

export interface ClubApplicationPolicyView {
  applicationsOpen: boolean;
  requirementsText: string | null;
  expectedReviewSlaHours: number | null;
  pendingApplicationCount: number;
}

export interface PublicClubDetailView {
  clubId: string;
  name: string;
  memberCount: number;
  activeMemberCount: number;
  adminCount: number;
  powerRating: number;
  totalPoints: number;
  treasuryBalance: number;
  pointPool: number;
  relations: PublicClubRelationView[];
  honors: PublicClubHonorView[];
  applicationPolicy: ClubApplicationPolicyView;
  currentLineup: PublicClubLineupMemberView[];
  recentMatches: PublicClubRecentMatchView[];
}

export interface RankSnapshotView {
  platform: RankPlatform;
  tier: string;
  stars: number | null;
}

export interface PlayerLeaderboardEntry {
  playerId: string;
  nickname: string;
  elo: number;
  currentRank: RankSnapshotView;
  normalizedRankScore: number | null;
  clubIds: string[];
  status: PlayerStatus;
}

export interface ClubLeaderboardEntry {
  clubId: string;
  name: string;
  powerRating: number;
  totalPoints: number;
  memberCount: number;
}

export type PublicScheduleResponse = PublicScheduleView;
export type PublicClubDirectoryEntryResponse = PublicClubDirectoryEntry;
export type PublicPlayerLeaderboardEntryResponse = PlayerLeaderboardEntry;
export type PublicClubLeaderboardEntryResponse = ClubLeaderboardEntry;
export type PublicClubDetailResponse = PublicClubDetailView;
export type PublicTournamentSummaryResponse = PublicTournamentSummaryView;
export type PublicTournamentStageResponse = PublicTournamentStageView;
export type PublicTournamentDetailResponse = PublicTournamentDetailView;
