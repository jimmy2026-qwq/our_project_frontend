import type { PlayerStatus } from '@/objects/tournament';

export interface PlayerListQuery {
  clubId?: string;
  status?: PlayerStatus;
  nickname?: string;
  limit?: number;
  offset?: number;
}
