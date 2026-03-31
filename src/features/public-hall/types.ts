import type {
  ClubPublicProfile,
  ClubSummary,
  ListEnvelope,
  PlayerLeaderboardEntry,
  PublicSchedule,
  StageStatus,
  TournamentPublicProfile,
  TournamentStatus,
} from '@/domain/models';

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
  leaderboard: LoadState<PlayerLeaderboardEntry>;
  clubs: LoadState<ClubSummary>;
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
