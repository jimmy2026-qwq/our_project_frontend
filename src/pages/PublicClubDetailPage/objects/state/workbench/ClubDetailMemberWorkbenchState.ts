import type { ClubAdminMemberEntry } from '@/pages/PublicClubDetailPage/objects/contribution/ClubAdminMemberEntry';

export interface ClubDetailMemberWorkbenchState {
  clubMemberNames: string[];
  clubMembers: ClubAdminMemberEntry[];
  featuredPlayerNames: string[];
  isClubMember: boolean;
  isClubMembersLoading: boolean;
  isCurrentClubAdmin: boolean;
  isCurrentMember: boolean;
  isFeaturedMember: boolean;
}
