import type {
  ClubRelationView,
  PublicClubLineupMemberView,
  PublicClubRecentMatchView,
} from '@/objects/club';
import type { ClubApplicationPolicyView } from './ClubApplicationPolicyView';
import type { PublicClubHonorView } from './PublicClubHonorView';

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
  relations: ClubRelationView[];
  honors: PublicClubHonorView[];
  applicationPolicy: ClubApplicationPolicyView;
  currentLineup: PublicClubLineupMemberView[];
  recentMatches: PublicClubRecentMatchView[];
}
