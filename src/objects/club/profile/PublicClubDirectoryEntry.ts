import type { ClubRelationView } from '@/objects/club';

export interface PublicClubDirectoryEntry {
  clubId: string;
  name: string;
  memberCount: number;
  activeMemberCount: number;
  adminCount: number;
  powerRating: number;
  totalPoints: number;
  treasuryBalance: number;
  pointPool: number;
  allianceCount: number;
  rivalryCount: number;
  strongestRivalClubId: string | null;
  strongestRivalPower: number | null;
  honorTitles: string[];
  relations: ClubRelationView[];
}
