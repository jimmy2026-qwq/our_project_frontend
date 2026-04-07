export type Role =
  | 'Guest'
  | 'RegisteredPlayer'
  | 'ClubAdmin'
  | 'TournamentAdmin'
  | 'SuperAdmin';

export type TournamentStatus =
  | 'Draft'
  | 'Registration'
  | 'RegistrationOpen'
  | 'InProgress'
  | 'Finished';
export type StageStatus = 'Pending' | 'Active' | 'Completed';
export type TableStatus =
  | 'WaitingPreparation'
  | 'InProgress'
  | 'Scoring'
  | 'Archived'
  | 'AppealPending';

export interface ListEnvelope<T, F = Record<string, unknown>> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  appliedFilters: F;
}

export interface PublicSchedule {
  tournamentId: string;
  tournamentName: string;
  tournamentStatus: TournamentStatus;
  stageId: string;
  stageName: string;
  stageStatus: StageStatus;
  scheduledAt: string;
  isUnpublished?: boolean;
}

export interface PlayerLeaderboardEntry {
  playerId: string;
  nickname: string;
  clubName: string;
  elo: number;
  rank: number;
  currentRank?: string | null;
  normalizedRankScore?: number | null;
  status: 'Active' | 'Inactive' | 'Banned';
}

export interface ClubSummary {
  id: string;
  name: string;
  memberCount: number;
  powerRating: number;
  treasury: number;
  relations: Array<'Alliance' | 'Hostile'>;
}

export interface TournamentPublicProfile {
  id: string;
  name: string;
  status: TournamentStatus;
  tagline: string;
  description: string;
  venue: string;
  stageCount: number;
  whitelistType: 'Club' | 'Player' | 'Mixed';
  clubIds?: string[];
  clubCount?: number;
  playerCount?: number;
  whitelistCount?: number;
  nextStageId: string;
  nextStageName: string;
  nextStageStatus: StageStatus;
  nextScheduledAt: string;
  stages?: Array<{
    stageId: string;
    name: string;
    status: StageStatus;
    roundCount: number;
    tableCount: number;
    pendingTablePlanCount: number;
  }>;
}

export interface ClubPublicProfile {
  id: string;
  name: string;
  slogan: string;
  description: string;
  memberCount: number;
  powerRating: number;
  treasury: number;
  relations: Array<'Alliance' | 'Hostile'>;
  featuredPlayers: string[];
  activeTournaments: Array<{
    id: string;
    name: string;
    status?: TournamentStatus;
    source?: 'recent' | 'invited';
  }>;
}

export interface GuestSession {
  id: string;
  displayName: string;
  createdAt: string;
}

export interface ClubApplication {
  id: string;
  clubId: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Withdrawn';
  applicantName: string;
  message: string;
  createdAt: string;
  guestSessionId?: string;
}

export interface SessionInfo {
  principalKind: 'Anonymous' | 'Guest' | 'RegisteredPlayer';
  principalId: string;
  displayName: string;
  authenticated: boolean;
  roles: AuthRoleFlags;
  player?: {
    id: string;
    userId: string;
    nickname: string;
  } | null;
  guestSession?: {
    id: string;
    displayName: string;
  } | null;
}

export interface AuthRoleFlags {
  isGuest: boolean;
  isRegisteredPlayer: boolean;
  isClubAdmin: boolean;
  isTournamentAdmin: boolean;
  isSuperAdmin: boolean;
}

export interface AuthUser {
  userId: string;
  username: string;
  displayName: string;
  operatorId?: string;
  roles: AuthRoleFlags;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  displayName: string;
  password: string;
}

export interface PlayerProfile {
  playerId: string;
  applicantUserId?: string;
  displayName: string;
  playerStatus?: 'Active' | 'Inactive' | 'Banned';
  elo?: number;
  clubIds?: string[];
}

export interface ClubApplicationView {
  applicationId: string;
  clubId: string;
  clubName: string;
  applicant: PlayerProfile;
  submittedAt: string;
  message: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Withdrawn';
  reviewedBy?: string | null;
  reviewedByDisplayName?: string | null;
  reviewedAt?: string | null;
  reviewNote?: string | null;
  withdrawnByPrincipalId?: string | null;
  canReview: boolean;
  canWithdraw: boolean;
}

export interface DemoSummary {
  publicSchedules?: PublicSchedule[];
  publicClubDirectory?: ClubSummary[];
  playerLeaderboard?: PlayerLeaderboardEntry[];
  recommendedOperatorId?: string;
}

export interface DashboardSummary {
  ownerId: string;
  ownerType: 'player' | 'club';
  headline: string;
  metrics: Array<{
    label: string;
    value: string;
    accent?: 'gold' | 'teal' | 'red';
  }>;
}

export interface FeatureModule {
  id: string;
  title: string;
  summary: string;
  entities: string[];
  primaryRoles: Role[];
  routes: string[];
}

export interface RoleCapability {
  role: Role;
  description: string;
  landingRoute: string;
  canRead: string[];
  canWrite: string[];
}

export interface TournamentTableSummary {
  id: string;
  stageId: string;
  tableCode: string;
  status: TableStatus;
  playerIds: string[];
  seatCount: number;
}

export interface MatchRecordSummary {
  id: string;
  tournamentId: string;
  stageId: string;
  tableId: string;
  recordedAt: string;
  winnerId: string;
  summary: string;
}

export interface AppealSummary {
  id: string;
  tournamentId: string;
  tableId: string;
  status: 'Open' | 'Resolved' | 'Rejected' | 'Escalated';
  createdBy: string;
  createdAt: string;
  verdict: string;
}
