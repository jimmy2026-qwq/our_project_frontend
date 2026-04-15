import { clubsApi } from '@/api/clubs';
import type { Role } from '@/domain/common';
import { readClubApplicationInbox, upsertClubApplicationInboxItem } from '@/lib/club-applications';

import { toApplicationView, type ApplicationInboxState } from './data.shared';

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
    const envelope = await clubsApi.getClubApplications(clubId, {
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
      warning: error instanceof Error ? error.message : 'Unable to load the live application inbox.',
    };
  }
}

export async function reviewApplication(
  clubId: string,
  applicationId: string,
  operatorId: string,
  decision: 'approve' | 'reject',
) {
  const application = await clubsApi.reviewClubApplication(clubId, applicationId, {
    operatorId,
    decision,
    note: `${decision}d from member hub`,
  });
  upsertClubApplicationInboxItem({
    id: application.applicationId,
    clubId: application.clubId,
    clubName: application.clubName,
    operatorId: application.applicant.playerId || application.applicant.applicantUserId || '',
    applicantName: application.applicant.displayName,
    message: application.message,
    status: application.status,
    submittedAt: application.submittedAt,
    source: 'api',
  });
  return { source: 'api' as const };
}
