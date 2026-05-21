import { ListClubApplicationsAPI } from '@/api/club/ListClubApplicationsAPI';
import { ReviewClubApplicationAPI } from '@/api/club/ReviewClubApplicationAPI';
import type { Role } from '@/objects';
import type {
  ClubApplicationListQuery,
  ClubMembershipApplicationView,
  ListEnvelope,
  ReviewClubApplicationRequest,
} from '@/objects';
import {
  readClubApplicationInbox,
  upsertClubApplicationInboxItem,
} from '@/pages/objects/club/ClubApplicationInbox';
import { mapClubApplicationView } from '@/pages/objects/club/ClubMappers';
import type { ClubApplicationView } from '@/pages/objects/club';
import { sendAPI } from '@/system/api';
import { mapEnvelope } from '@/system/api/http';

import { toApplicationView, type ApplicationInboxState } from './data.shared';

function getClubApplications(
  clubId: string,
  filters: ClubApplicationListQuery,
) {
  return sendAPI(new ListClubApplicationsAPI(clubId, filters)).then(
    (envelope): ListEnvelope<ClubApplicationView> =>
      mapEnvelope(envelope, mapClubApplicationView),
  );
}

function reviewClubApplication(
  clubId: string,
  membershipId: string,
  payload: ReviewClubApplicationRequest,
) {
  return sendAPI<ClubMembershipApplicationView>(
    new ReviewClubApplicationAPI(clubId, membershipId, payload),
  ).then(mapClubApplicationView);
}

export async function loadClubApplicationInbox(
  clubId: string,
  operatorId: string,
  role: Role,
): Promise<ApplicationInboxState> {
  if (role !== 'ClubAdmin') {
    return {
      items: [],
      source: 'api',
    };
  }

  try {
    const envelope = await getClubApplications(clubId, {
      operatorId,
      status: 'Pending',
      limit: 20,
      offset: 0,
    });
    return {
      items: envelope.items,
      source: 'api',
    };
  } catch (error) {
    return {
      items: readClubApplicationInbox()
        .filter((item) => item.clubId === clubId)
        .map(toApplicationView),
      source: 'api',
      warning:
        error instanceof Error
          ? error.message
          : 'Unable to load the live application inbox.',
    };
  }
}

export async function reviewApplication(
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
