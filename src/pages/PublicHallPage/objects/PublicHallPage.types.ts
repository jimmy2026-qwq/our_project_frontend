import type { ListEnvelope, StageStatus, TournamentStatus } from '@/objects';
import type { ClubSummary } from '@/pages/objects/ClubSummary';
import type { AuthSession } from '@/providers/auth/AuthSession';

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
  status: 'Active' | 'Inactive' | 'Banned';
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

export type PublicHallLeaderboardStatus = 'Active' | 'Suspended' | 'Banned';

export interface PublicHallRankSnapshot {
  platform: string;
  tier: string;
  stars?: number | null;
}
