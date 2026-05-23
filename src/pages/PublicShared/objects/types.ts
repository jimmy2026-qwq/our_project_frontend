import type {
  ListEnvelope,
  StageStatus,
  TournamentStatus,
  } from '@/objects';
import type { ClubSummary } from '@/pages/objects/club';
import type { AuthSession } from '@/providers/auth/AuthSession';
import type {
  ClubPublicProfile,
  PlayerLeaderboardEntry,
  PublicSchedule,
  TournamentPublicProfile,
} from '@/pages/PublicShared/objects';

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

export interface HomeDataState {
  schedules: LoadState<PublicSchedule>;
  clubs: LoadState<ClubSummary>;
}

export interface PublicHallViewerContext {
  session: AuthSession | null;
}

export interface LeaderboardDataState {
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
