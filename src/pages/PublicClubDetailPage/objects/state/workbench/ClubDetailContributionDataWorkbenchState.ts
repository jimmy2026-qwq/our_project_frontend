import type { ClubContributionAuditEntry } from '@/objects';
import type { ClubContributionTitleField } from '@/pages/PublicClubDetailPage/objects/contribution/ClubContributionTitleField';

export interface ClubDetailContributionDataWorkbenchState {
  contributionChanges: ClubContributionAuditEntry[];
  contributionTitleFields: ClubContributionTitleField[];
  isContributionChangesLoading: boolean;
}
