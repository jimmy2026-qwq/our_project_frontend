import type { ClubRelationView } from './ClubRelationView';
import type { ClubRankNode } from './ClubRankNode';

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
