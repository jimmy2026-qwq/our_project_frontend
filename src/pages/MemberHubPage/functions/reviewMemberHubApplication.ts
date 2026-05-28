import { ReviewClubApplicationAPI } from '@/api/club/ReviewClubApplicationAPI';
import type {
  ClubMembershipApplicationView,
  ReviewClubApplicationRequest,
} from '@/objects';
import {
  upsertClubApplicationInboxItem,
} from '@/pages/objects/club/ClubApplicationInbox';
import { mapClubApplicationView } from '@/pages/objects/club/ClubMappers';
import { sendAPI } from '@/system/api';

function reviewClubApplication(
  clubId: string,
  membershipId: string,
  payload: ReviewClubApplicationRequest,
) {
  return sendAPI<ClubMembershipApplicationView>(
    new ReviewClubApplicationAPI(clubId, membershipId, payload),
  ).then(mapClubApplicationView);
}

export async function reviewMemberHubApplication(
  clubId: string,
  applicationId: string,
  operatorId: string,
  decision: 'approve' | 'reject',
) {
  const application = await reviewClubApplication(
    clubId,
    applicationId,
    {
      operatorId,
      decision,
      note: `${decision}d from member hub`,
    },
  );
  upsertClubApplicationInboxItem({
    id: application.applicationId,
    clubId: application.clubId,
    clubName: application.clubName,
    operatorId:
      application.applicant.playerId ||
      application.applicant.applicantUserId ||
      '',
    applicantName: application.applicant.displayName,
    message: application.message,
    status: application.status,
    submittedAt: application.submittedAt,
    source: 'api',
  });
  return { source: 'api' as const };
}

