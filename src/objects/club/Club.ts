import type { ClubRelation } from './ClubRelation';
import type { ClubRankNodeView } from './ClubRankNodeView';

export interface Club {
  id: string;
  name: string;
  members: string[];
  admins: string[];
  powerRating: number;
  treasuryBalance: number;
  totalPoints: number;
  pointPool: number;
  rankTree: ClubRankNodeView[];
  relations: ClubRelation[];
  dissolvedAt: string | null;
}
