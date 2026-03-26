export type Role =
  | 'Guest'
  | 'RegisteredPlayer'
  | 'ClubAdmin'
  | 'TournamentAdmin'
  | 'SuperAdmin';

export type TournamentStatus = 'Draft' | 'Registration' | 'InProgress' | 'Finished';
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
  nextStageId: string;
  nextStageName: string;
  nextStageStatus: StageStatus;
  nextScheduledAt: string;
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
  activeTournaments: string[];
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
