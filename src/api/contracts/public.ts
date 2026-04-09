import type { StageStatus, TournamentStatus } from '@/domain';

export interface PublicScheduleContract {
  tournamentId: string;
  tournamentName: string;
  tournamentStatus: TournamentStatus;
  stageId: string;
  stageName: string;
  stageStatus: StageStatus;
  currentRound?: number;
  roundCount?: number;
  startsAt: string;
  endsAt?: string;
  tableCount?: number;
  activeTableCount?: number;
  pendingTablePlanCount?: number;
  participantCount?: number;
  whitelistCount?: number;
}

export interface PublicTournamentStageContract {
  stageId: string;
  name: string;
  format?: string;
  order?: number;
  status: 'Pending' | 'Ready' | 'Active' | 'Completed';
  currentRound?: number;
  roundCount: number;
  tableCount: number;
  archivedTableCount?: number;
  pendingTablePlanCount: number;
  standings?: unknown | null;
  bracket?: unknown | null;
}

export interface PublicTournamentDetailContract {
  tournamentId: string;
  name: string;
  organizer: string;
  status: TournamentStatus;
  startsAt: string;
  endsAt: string;
  clubIds: string[];
  playerIds: string[];
  whitelistCount: number;
  stages: PublicTournamentStageContract[];
}

export interface PublicClubRelationContract {
  relation: 'Alliance' | 'Rivalry' | 'Neutral';
}

export interface PublicClubDirectoryEntryContract {
  clubId: string;
  name: string;
  memberCount: number;
  activeMemberCount?: number;
  adminCount?: number;
  powerRating: number;
  totalPoints?: number;
  treasuryBalance: number;
  pointPool?: number;
  allianceCount?: number;
  rivalryCount?: number;
  strongestRivalClubId?: string | null;
  strongestRivalPower?: number | null;
  honorTitles?: string[];
  relations: PublicClubRelationContract[];
}

export interface PublicClubHonorContract {
  title: string;
}

export interface PublicClubLineupMemberContract {
  nickname: string;
}

export interface PublicClubRecentMatchContract {
  tournamentId?: string;
  tournamentName: string;
}

export interface PublicClubApplicationPolicyContract {
  requirementsText?: string | string[] | null;
  applicationsOpen?: boolean;
  expectedReviewSlaHours?: number | number[] | null;
  pendingApplicationCount?: number | null;
}

export interface PublicClubDetailContract {
  clubId: string;
  name: string;
  memberCount: number;
  activeMemberCount?: number;
  adminCount?: number;
  powerRating: number;
  totalPoints?: number;
  treasuryBalance?: number;
  pointPool?: number;
  relations?: PublicClubRelationContract[];
  honors?: PublicClubHonorContract[];
  applicationPolicy?: PublicClubApplicationPolicyContract | null;
  currentLineup?: PublicClubLineupMemberContract[];
  recentMatches?: PublicClubRecentMatchContract[];
}

export interface LegacyDashboardOwnerPlayerContract {
  playerId: string;
}

export interface LegacyDashboardOwnerClubContract {
  clubId: string;
}

export type DashboardOwnerContract =
  | string
  | { Player: LegacyDashboardOwnerPlayerContract }
  | { Club: LegacyDashboardOwnerClubContract };

export interface DashboardContract {
  owner: DashboardOwnerContract;
  sampleSize: number;
  dealInRate: number;
  winRate: number;
  averageWinPoints: number;
  riichiRate: number;
  averagePlacement: number;
  topFinishRate: number;
  lastUpdatedAt: string;
  version: number;
}

export interface RankSnapshotContract {
  platform: string;
  tier: string;
  stars?: number | null;
}

export interface PlayerLeaderboardEntryContract {
  playerId: string;
  nickname: string;
  elo: number;
  currentRank?: RankSnapshotContract | null;
  normalizedRankScore?: number | null;
  clubIds: string[];
  status: 'Active' | 'Suspended' | 'Banned';
}
