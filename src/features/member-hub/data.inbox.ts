import { clubsApi } from '@/api/clubs';
import type { Role } from '@/domain/common';
import { readClubApplicationInbox, updateClubApplicationInboxStatus, upsertClubApplicationInboxItem } from '@/lib/club-applications';

import { toApplicationView, type ApplicationInboxState } from './data.shared';

export async function loadClubApplicationInbox(
  clubId: string,
  operatorId: string,
  role: Role,
): Promise<ApplicationInboxState> {
  if (role !== 'ClubAdmin') {
    return {
      items: [],
      source: 'mock',
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
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Application inbox fallback to mock.',
    };
  }
}

export async function reviewApplication(
  clubId: string,
  applicationId: string,
  operatorId: string,
  decision: 'approve' | 'reject',
) {
  try {
    const application = await clubsApi.reviewClubApplication(clubId, applicationId, {
      operatorId,
      decision,
      note: `${decision}d from member hub`,
    });
    upsertClubApplicationInboxItem({
      id: application.applicationId,
      clubId: application.clubId,
      clubName: application.clubName,
      operatorId: application.applicant.playerId,
      applicantName: application.applicant.displayName,
      message: application.message,
      status: application.status,
      submittedAt: application.submittedAt,
      source: 'api',
    });
    return { source: 'api' as const };
  } catch {
    updateClubApplicationInboxStatus(applicationId, decision === 'approve' ? 'Approved' : 'Rejected');
    return {
      source: 'mock' as const,
      warning: 'The member hub review used the local inbox fallback.',
    };
  }
}
