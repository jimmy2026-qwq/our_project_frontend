import type { ClubPrivilegeCode } from '../ClubPrivilegeCode';

export interface ClubMemberPrivilegeListQuery {
  playerId?: string;
  privilege?: ClubPrivilegeCode;
  rankCode?: string;
  limit?: number;
  offset?: number;
}
