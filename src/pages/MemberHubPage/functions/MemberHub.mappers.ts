import type {
  ClubMembershipApplicantView,
  ClubMembershipApplicationView,
  ClubView,
} from '@/objects/club';
import { ClubApplicationStatuses } from '@/objects/club';
import type { ClubApplicationView } from '@/pages/shared_objects/club/ClubApplicationView';
import type { ClubSummary } from '@/pages/shared_objects/club/ClubSummary';
import { toClubSummaryRelation } from '@/pages/shared_objects/club/functions/toClubSummaryRelation';

import type { MemberHubApplicationInboxItem } from '../objects/MemberHub.types';

function normalizeApplicant(
  applicant: ClubMembershipApplicantView,
): ClubApplicationView['applicant'] {
  return {
    playerId: applicant.playerId ?? '',
    displayName: applicant.displayName,
    playerStatus: applicant.playerStatus ?? undefined,
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

export function toClubSummary(item: ClubView): ClubSummary {
  return {
    id: item.id,
    name: item.name,
    memberCount: item.members.length,
    powerRating: item.powerRating,
    treasury: item.treasuryBalance ?? item.pointPool ?? item.totalPoints ?? 0,
    relations: (item.relations ?? []).map(toClubSummaryRelation),
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

export function toClubApplicationViewFromInboxItem(
  item: MemberHubApplicationInboxItem,
): ClubApplicationView {
  return {
    applicationId: item.id,
    clubId: item.clubId,
    clubName: item.clubName,
    applicant: {
      playerId: item.playerId,
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
    canReview: item.status === ClubApplicationStatuses.Pending,
    canWithdraw: false,
  };
}
