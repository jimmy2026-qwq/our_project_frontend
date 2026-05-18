export interface CreatePlayerPayload {
  userId: string;
  nickname: string;
  rankPlatform: string;
  tier: string;
  stars?: number;
  initialElo?: number;
}
