import type {
  ClubMembershipApplicantView,
  ClubMembershipApplicationView,
} from '@/objects/club';
import type { ClubApplicationView } from '@/pages/objects/ClubApplicationViews';

import { toPlayerStatus } from './ClubDetailPlayer.mappers';

function normalizeApplicant(
  applicant: ClubMembershipApplicantView,
): ClubApplicationView['applicant'] {
  return {
    playerId: applicant.playerId ?? '',
    applicantUserId: applicant.applicantUserId ?? undefined,
    displayName: applicant.displayName,
    playerStatus: applicant.playerStatus
      ? toPlayerStatus(applicant.playerStatus)
      : undefined,
    currentRank: applicant.currentRank ?? undefined,
    elo: applicant.elo ?? undefined,
    clubIds: applicant.clubIds ?? [],
  };
}

function normalizeApplicationOptionalFields(
  item: ClubMembershipApplicationView,
) {
  return {
    message: item.message ?? '',
    reviewedBy: item.reviewedBy ?? null,
    reviewedByDisplayName: item.reviewedByDisplayName ?? null,
    reviewedAt: item.reviewedAt ?? null,
    reviewNote: item.reviewNote ?? null,
    withdrawnByPrincipalId: item.withdrawnByPrincipalId ?? null,
  };
}

export function toClubApplicationView(
  item: ClubMembershipApplicationView,
): ClubApplicationView {
  const optionalFields = normalizeApplicationOptionalFields(item);

  return {
    applicationId: item.applicationId,
    clubId: item.clubId,
    clubName: item.clubName,
    applicant: normalizeApplicant(item.applicant),
    submittedAt: item.submittedAt,
    message: optionalFields.message,
    status: item.status,
    reviewedBy: optionalFields.reviewedBy,
    reviewedByDisplayName: optionalFields.reviewedByDisplayName,
    reviewedAt: optionalFields.reviewedAt,
    reviewNote: optionalFields.reviewNote,
    withdrawnByPrincipalId: optionalFields.withdrawnByPrincipalId,
    canReview: item.canReview,
    canWithdraw: item.canWithdraw,
  };
}
