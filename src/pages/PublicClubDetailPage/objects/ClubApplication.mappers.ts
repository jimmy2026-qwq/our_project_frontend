import type { PlayerProfile } from '@/pages/objects/PlayerProfile';
import type { ClubApplication } from '@/pages/objects/ClubApplicationViews';

import type { ClubApplicationMutation } from '../objects/ClubApplication.types';

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
