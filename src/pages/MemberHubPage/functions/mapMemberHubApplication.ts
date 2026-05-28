import type { ClubApplicationView } from '@/pages/objects/club';
import type { ClubApplicationInboxItem } from '@/pages/objects/club';

export function mapMemberHubApplication(
  item: ClubApplicationInboxItem,
): ClubApplicationView {
  return {
    applicationId: item.id,
    clubId: item.clubId,
    clubName: item.clubName,
    applicant: {
      playerId: item.operatorId,
      displayName: item.applicantName,
    },
    submittedAt: item.submittedAt,
    message: item.message,
    status: item.status,
    reviewedBy: null,
    reviewedByDisplayName: null,
    reviewedAt: null,
    reviewNote: null,
    withdrawnByPrincipalId: null,
    canReview: item.status === 'Pending',
    canWithdraw: false,
  };
}

