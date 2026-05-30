import type { PlayerStatus } from '@/objects/player';

export interface PlatformAdminPlayerView {
  playerId: string;
  userId: string;
  nickname: string;
  status: PlayerStatus;
  clubIds: string[];
  bannedReason: string | null;
  isSuperAdmin: boolean;
}
