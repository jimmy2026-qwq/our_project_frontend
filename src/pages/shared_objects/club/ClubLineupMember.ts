import type { ClubPrivilegeCode } from '@/objects';
import type { ClubLineupMemberStatus } from './ClubLineupMemberStatus';
import type { ClubLineupRank } from './ClubLineupRank';

export interface ClubLineupMember {
  playerId?: string;
  nickname: string;
  elo?: number;
  currentRank?: ClubLineupRank | null;
  status?: ClubLineupMemberStatus;
  isAdmin?: boolean;
  internalTitle?: string | null;
  privileges?: ClubPrivilegeCode[];
}
