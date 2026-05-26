export interface ClubMemberPrivilegeSnapshot {
  playerId: string;
  contribution: number;
  rankCode: string;
  rankLabel: string;
  privileges: string[];
  isAdmin: boolean;
  internalTitle: string | null;
}
