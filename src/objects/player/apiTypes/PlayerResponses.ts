import type { PlayerStatus, RankPlatform } from '@/objects/tournament';

export interface PlayerRoleFlagsView {
  isRegisteredPlayer: boolean;
  isClubAdmin: boolean;
  isTournamentAdmin: boolean;
  isSuperAdmin: boolean;
}

export interface PlayerProfileView {
  playerId: string;
  userId: string;
  nickname: string;
  registeredAt: string;
  currentRank: {
    platform: RankPlatform;
    tier: string;
    stars: number | null;
  };
  status: PlayerStatus;
  elo: number;
  clubId: string | null;
  affiliatedClubIds: string[];
  roles: PlayerRoleFlagsView;
  bannedReason: string | null;
}

export type PlayerResponse = PlayerProfileView;
