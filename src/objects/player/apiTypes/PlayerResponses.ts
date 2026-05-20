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
    platform: string;
    tier: string;
    stars?: number | null;
  };
  status: 'Active' | 'Inactive' | 'Banned';
  elo: number;
  clubId: string | null;
  affiliatedClubIds: string[];
  roles: PlayerRoleFlagsView;
  bannedReason: string | null;
}

export type PlayerResponse = PlayerProfileView;
