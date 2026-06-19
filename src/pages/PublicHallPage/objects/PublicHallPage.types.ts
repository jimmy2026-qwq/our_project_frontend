import {
  StageStatuses,
  TournamentStatuses,
  type ListEnvelope,
  type StageStatus,
  type TournamentStatus,
} from '@/objects';
import type { ClubSummary } from '@/pages/shared_objects/club/ClubSummary';
import type { AuthContextSession } from '@/app/auth/AuthContextSession';
import {
  PublicHallLeaderboardDisplayStatuses,
  type PublicHallLeaderboardDisplayStatus,
} from './PublicHallLeaderboardDisplayStatus';

export type DataSource = 'api' | 'mock';
export type PublicView = 'schedules' | 'clubs' | 'leaderboard';

export interface PublicSchedule {
  tournamentId: string;
  tournamentName: string;
  tournamentStatus: TournamentStatus;
  stageId: string;
  stageName: string;
  stageStatus: StageStatus;
  scheduledAt: string;
  endsAt?: string;
  currentRound?: number;
  roundCount?: number;
  tableCount?: number;
  activeTableCount?: number;
  pendingTablePlanCount?: number;
  participantCount?: number;
  whitelistCount?: number;
  isUnpublished?: boolean;
}

export interface PlayerLeaderboardEntry {
  playerId: string;
  nickname: string;
  clubName: string;
  clubIds?: string[];
  elo: number;
  rank: number;
  currentRank?: string | null;
  currentRankSnapshot?: {
    platform: string;
    tier: string;
    stars?: number | null;
  } | null;
  normalizedRankScore?: number | null;
  status: PublicHallLeaderboardDisplayStatus;
}

export interface LoadState<T> {
  envelope: ListEnvelope<T>;
  source: DataSource;
  warning?: string;
}

export interface HomeDataState {
  schedules: LoadState<PublicSchedule>;
  clubs: LoadState<ClubSummary>;
}

export interface PublicHallViewerContext {
  session: AuthContextSession | null;
}

export interface LeaderboardDataState {
  leaderboard: LoadState<PlayerLeaderboardEntry>;
}

export interface PublicHallState {
  activeView: PublicView;
  scheduleTournamentStatus?: TournamentStatus;
  scheduleStageStatus?: StageStatus;
  leaderboardClubId: string;
  leaderboardStatus?: PublicHallLeaderboardDisplayStatus;
  clubActiveOnly: boolean;
}

export const DEFAULT_PUBLIC_HALL_STATE: PublicHallState = {
  activeView: 'schedules',
  scheduleTournamentStatus: TournamentStatuses.InProgress,
  scheduleStageStatus: StageStatuses.Active,
  leaderboardClubId: '',
  leaderboardStatus: PublicHallLeaderboardDisplayStatuses.Active,
  clubActiveOnly: true,
};

export const PUBLIC_HALL_CACHE_TTL_MS = 15_000;

export interface PublicHallRankSnapshot {
  platform: string;
  tier: string;
  stars?: number | null;
}
