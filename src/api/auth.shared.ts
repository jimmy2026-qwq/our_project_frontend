import type { PlayerProfile } from '@/domain';
import type { PlayerProfileContract } from './contracts/auth';

export interface SessionQuery {
  operatorId?: string;
  guestSessionId?: string;
}

export interface CreateGuestSessionPayload {
  displayName: string;
}

export interface CreatePlayerPayload {
  userId: string;
  nickname: string;
  rankPlatform: string;
  tier: string;
  stars?: number;
  initialElo?: number;
}

export interface DemoSummaryQuery {
  variant?: 'Basic' | 'Leaderboard' | 'Appeal';
  bootstrapIfMissing?: boolean;
  refreshDerived?: boolean;
}

export function mapPlayerProfile(item: PlayerProfileContract): PlayerProfile {
  return {
    playerId: item.id,
    applicantUserId: item.userId,
    displayName: item.nickname,
    playerStatus: item.status,
    elo: item.elo,
    clubIds: item.boundClubIds,
  };
}
