export type ClubRelationKind = 'Alliance' | 'Rivalry' | 'Neutral';

export interface ClubRelation {
  relation: ClubRelationKind;
}

export interface Club {
  id: string;
  name: string;
  members: string[];
  admins: string[];
  powerRating: number;
  treasuryBalance: number;
  totalPoints: number;
  pointPool: number;
  relations: ClubRelation[];
  dissolvedAt: string | null;
}

export interface ClubPrivilegeDefinition {
  code: string;
  label: string;
  description: string;
  delegatedPermissions: string[];
}

export interface ClubMemberPrivilegeSnapshot {
  playerId: string;
  contribution: number;
  rankCode: string;
  rankLabel: string;
  privileges: string[];
  isAdmin: boolean;
  internalTitle: string | null;
}
