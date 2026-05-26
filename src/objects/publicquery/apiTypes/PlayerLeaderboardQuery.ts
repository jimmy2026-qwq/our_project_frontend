import type { PlayerStatus } from '@/objects/player';

export interface PlayerLeaderboardQuery {
  clubId?: string;
  status?: PlayerStatus;
  limit?: number;
  offset?: number;
}
