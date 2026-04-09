import type {
  AuthSession,
  ClubPublicProfile,
  ClubSummary,
  ListEnvelope,
  PlayerLeaderboardEntry,
  PublicSchedule,
  StageStatus,
  TournamentPublicProfile,
  TournamentStatus,
} from '@/domain';

export type DataSource = 'api' | 'mock';
export type PublicView = 'schedules' | 'clubs' | 'leaderboard';

export interface LoadState<T> {
  envelope: ListEnvelope<T>;
  source: DataSource;
  warning?: string;
}

export interface DetailState<T> {
  item: T | null;
  source: DataSource;
  warning?: string;
}

export interface HomeDataPayload {
  schedules: LoadState<PublicSchedule>;
  clubs: LoadState<ClubSummary>;
}

export interface PublicHallViewerContext {
  session: AuthSession | null;
}

export interface LeaderboardDataPayload {
  leaderboard: LoadState<PlayerLeaderboardEntry>;
}

export interface PublicHallState {
  activeView: PublicView;
  scheduleTournamentStatus: TournamentStatus | '';
  scheduleStageStatus: StageStatus | '';
  leaderboardClubId: string;
  leaderboardStatus: 'Active' | 'Inactive' | 'Banned' | '';
  clubActiveOnly: boolean;
}

export type TournamentDetailState = DetailState<TournamentPublicProfile>;
export type ClubDetailState = DetailState<ClubPublicProfile>;

export type PublicHallLeaderboardStatus = 'Active' | 'Suspended' | 'Banned';

export interface PublicHallRankSnapshot {
  platform: string;
  tier: string;
  stars?: number | null;
}

export interface PublicHallStageLineupSeat {
  playerId: string;
  preferredWind?: string | null;
  reserve?: boolean;
}

export interface PublicHallStageLineupSubmission {
  id: string;
  clubId: string;
  submittedBy: string;
  submittedAt: string;
  seats: PublicHallStageLineupSeat[];
  note?: string | null;
}

export interface PublicHallTournamentStageDetail {
  id: string;
  name: string;
  status: string;
  roundCount?: number;
  pendingTablePlans?: unknown[];
  lineupSubmissions?: PublicHallStageLineupSubmission[];
}

export interface PublicHallTournamentAdminDetail {
  id: string;
  name: string;
  organizer: string;
  status: string;
  startsAt: string;
  endsAt: string;
  participatingClubs?: string[];
  participatingPlayers?: string[];
  whitelist?: unknown[];
  stages?: PublicHallTournamentStageDetail[];
}
