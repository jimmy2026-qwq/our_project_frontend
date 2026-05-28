import type { PlayerStatus } from '@/objects/player';
import type { RankSnapshotView } from '@/objects/tournament';

export interface PlayerLeaderboardEntry {
  playerId: string;
  nickname: string;
  elo: number;
  currentRank: RankSnapshotView;
  normalizedRankScore: number | null;
  clubIds: string[];
  status: PlayerStatus;
}
