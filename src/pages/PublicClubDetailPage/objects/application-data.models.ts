import type { ClubApplication } from '@/pages/objects/club';
import type { PlayerProfile } from '@/pages/objects/player';
import {
  isProvisionalClubApplicationId,
  readClubApplicationInboxItem,
  readClubApplicationsByOperator,
} from '@/pages/objects/club';

import type { ClubApplicationMutation } from './application-data.types';

export function toClubApplicationViewModel(view: {
  applicationId: string;
  clubId: string;
  applicant: PlayerProfile;
  message: string;
  status: ClubApplication['status'];
  submittedAt: string;
}) {
  return {
    id: view.applicationId,
    clubId: view.clubId,
    status: view.status,
    applicantName: view.applicant.displayName,
    message: view.message,
    createdAt: view.submittedAt,
  } satisfies ClubApplication;
}

export function toClubApplicationMutationModel(
  clubId: string,
  fallbackApplicantName: string,
  application: ClubApplicationMutation,
): ClubApplication {
  return {
    id: application.id,
    clubId,
    status: application.status,
    applicantName: application.displayName.trim() || fallbackApplicantName,
    message: application.message?.trim() || '',
    createdAt: application.submittedAt,
  };
}

export function getTrackedApplication(
  operatorId: string,
  clubId: string,
  applicationId?: string,
) {
  if (applicationId) {
    const tracked = readClubApplicationInboxItem(applicationId);

    if (tracked?.clubId === clubId) {
      return tracked;
    }
  }

  return (
    readClubApplicationsByOperator(operatorId)
      .filter((item) => item.clubId === clubId)
      .sort((left, right) => {
        const leftProvisional = isProvisionalClubApplicationId(left.id);
        const rightProvisional = isProvisionalClubApplicationId(right.id);

        if (leftProvisional !== rightProvisional) {
          return leftProvisional ? 1 : -1;
        }

        return Date.parse(right.submittedAt) - Date.parse(left.submittedAt);
      })[0] ?? null
  );
}
