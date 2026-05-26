import type { RankPlatform } from '../RankPlatform';

export interface CreatePlayerRequest {
  userId: string;
  nickname: string;
  rankPlatform: RankPlatform;
  tier: string;
  stars?: number;
  initialElo?: number;
}
