import type { PlayerStatus } from '@/objects/player';

export interface ClubMemberListQuery {
  status?: PlayerStatus;
  nickname?: string;
  limit?: number;
  offset?: number;
}
