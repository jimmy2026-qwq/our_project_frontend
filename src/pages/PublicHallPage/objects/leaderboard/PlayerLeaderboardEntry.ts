import type { PublicHallRankSnapshot } from './PublicHallRankSnapshot';

import type { PublicHallLeaderboardDisplayStatus } from '../PublicHallLeaderboardDisplayStatus';

export interface PlayerLeaderboardEntry {
  playerId: string;
  nickname: string;
  clubName: string;
  clubIds?: string[];
  elo: number;
  rank: number;
  currentRank?: string | null;
  currentRankSnapshot?: PublicHallRankSnapshot | null;
  normalizedRankScore?: number | null;
  status: PublicHallLeaderboardDisplayStatus;
}
