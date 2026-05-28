import type { ClubApplicationPolicyView } from './ClubApplicationPolicyView';
import type { PublicClubHonorView } from './PublicClubHonorView';
import type { PublicClubLineupMemberView } from './PublicClubLineupMemberView';
import type { PublicClubRecentMatchView } from './PublicClubRecentMatchView';
import type { PublicClubRelationView } from './PublicClubRelationView';

export interface PublicClubDetailView {
  clubId: string;
  name: string;
  memberCount: number;
  activeMemberCount: number;
  adminCount: number;
  powerRating: number;
  totalPoints: number;
  treasuryBalance: number;
  pointPool: number;
  relations: PublicClubRelationView[];
  honors: PublicClubHonorView[];
  applicationPolicy: ClubApplicationPolicyView;
  currentLineup: PublicClubLineupMemberView[];
  recentMatches: PublicClubRecentMatchView[];
}
