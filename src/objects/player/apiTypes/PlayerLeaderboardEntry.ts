import type { PlayerStatus, RankSnapshot } from '@/objects/player';

export interface PlayerLeaderboardEntry {
  playerId: string;
  nickname: string;
  elo: number;
  currentRank: RankSnapshot;
  normalizedRankScore: number | null;
  clubIds: string[];
  status: PlayerStatus;
}
