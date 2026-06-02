import type { ClubRankNode, ClubRelationView } from '@/objects/club';

export interface ClubView {
  id: string;
  name: string;
  members: string[];
  admins: string[];
  powerRating: number;
  treasuryBalance: number;
  totalPoints: number;
  pointPool: number;
  rankTree: ClubRankNode[];
  relations: ClubRelationView[];
  dissolvedAt: string | null;
}
