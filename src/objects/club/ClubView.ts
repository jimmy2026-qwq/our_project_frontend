import type { ClubRelationView } from './ClubRelationView';
import type { ClubRankNodeView } from './ClubRankNodeView';

export interface ClubView {
  id: string;
  name: string;
  members: string[];
  admins: string[];
  powerRating: number;
  treasuryBalance: number;
  totalPoints: number;
  pointPool: number;
  rankTree: ClubRankNodeView[];
  relations: ClubRelationView[];
  dissolvedAt: string | null;
}
