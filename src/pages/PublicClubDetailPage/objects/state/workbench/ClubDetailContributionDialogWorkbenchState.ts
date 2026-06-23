import type { ClubAdminMemberEntry } from '@/pages/PublicClubDetailPage/objects/contribution/ClubAdminMemberEntry';

export interface ClubDetailContributionDialogWorkbenchState {
  isContributionDialogOpen: boolean;
  isContributionSubmitting: boolean;
  isContributionTitleDialogOpen: boolean;
  isContributionTitleSubmitting: boolean;
  isTitleDialogOpen: boolean;
  isTitleSubmitting: boolean;
  selectedContributionMember: ClubAdminMemberEntry | null;
  selectedTitleMember: ClubAdminMemberEntry | null;
}
