import type { RankPlatform } from '@/objects/tournament';

export interface CreatePlayerRequest {
  userId: string;
  nickname: string;
  rankPlatform: RankPlatform;
  tier: string;
  stars?: number;
  initialElo?: number;
}
