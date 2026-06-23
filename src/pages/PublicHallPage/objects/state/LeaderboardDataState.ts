import type { PlayerLeaderboardEntry } from '../leaderboard/PlayerLeaderboardEntry';
import type { LoadState } from './LoadState';

export interface LeaderboardDataState {
  leaderboard: LoadState<PlayerLeaderboardEntry>;
}
