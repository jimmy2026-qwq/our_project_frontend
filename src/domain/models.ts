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

