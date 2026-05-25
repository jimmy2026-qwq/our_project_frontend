import type { PlayerStatus } from '@/objects/tournament';

export interface PlatformAdminPlayerView {
  playerId: string;
  userId: string;
  nickname: string;
  status: PlayerStatus;
  clubIds: string[];
  bannedReason: string | null;
  isSuperAdmin: boolean;
}

export interface PlatformAdminClubView {
  clubId: string;
  name: string;
  creator: string;
  createdAt: string;
  memberCount: number;
  adminCount: number;
  totalPoints: number;
  powerRating: number;
  dissolvedAt: string | null;
  dissolvedBy: string | null;
}

export type PlatformAdminPlayerResponse = PlatformAdminPlayerView;
export type PlatformAdminClubResponse = PlatformAdminClubView;
