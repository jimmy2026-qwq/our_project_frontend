import type { PlayerStatus } from '../PlayerStatus';

export interface PlayerListQuery {
  clubId?: string;
  status?: PlayerStatus;
  nickname?: string;
  limit?: number;
  offset?: number;
}
