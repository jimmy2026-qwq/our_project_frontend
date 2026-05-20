import type { PlayerProfileView as PlayerProfile } from '@/objects/player';

export type PlayerProfileView = PlayerProfile;

export interface ClubRelation {
  relation: 'Alliance' | 'Rivalry' | 'Neutral';
}

export interface Club {
  id: string;
  name: string;
  members: string[];
  admins?: string[];
  powerRating: number;
  treasuryBalance?: number;
  totalPoints?: number;
  pointPool?: number;
  relations?: ClubRelation[];
  dissolvedAt?: string | null;
}

export interface ClubPrivilegeDefinition {
  key: string;
  label?: string;
  description?: string;
}

export interface ClubMemberPrivilegeSnapshot {
  clubId: string;
  playerId: string;
  rankCode: string;
  privileges: string[];
}
