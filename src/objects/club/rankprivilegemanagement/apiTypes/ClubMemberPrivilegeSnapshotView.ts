import type { ClubPrivilegeCode } from '../ClubPrivilegeCode';

export interface ClubMemberPrivilegeSnapshotView {
  playerId: string;
  contribution: number;
  rankCode: string;
  rankLabel: string;
  privileges: ClubPrivilegeCode[];
  isAdmin: boolean;
  internalTitle: string | null;
}
