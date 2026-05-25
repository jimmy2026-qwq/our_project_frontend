import type { PlayerProfile } from '@/pages/objects/player';
import { mapPlayerClubIds, mapPlayerStatus } from '@/pages/objects/player';
import type { ClubSummary } from './ClubSummary';
import type { ClubApplicationView } from './ClubApplicationViews';

import type {
  ClubMembershipApplicantView,
  ClubMembershipApplicationView,
  Club,
} from '@/objects/club';
import type { PlayerProfileView } from '@/objects/player';

export function mapClub(item: Club): ClubSummary {
  return {
    id: item.id,
    name: item.name,
    memberCount: item.members.length,
    powerRating: item.powerRating,
    treasury: item.treasuryBalance ?? item.pointPool ?? item.totalPoints ?? 0,
    relations: (item.relations ?? []).map((relation) =>
      relation.relation === 'Alliance' ? 'Alliance' : 'Hostile',
    ),
  };
}

export function mapClubMember(item: PlayerProfileView): PlayerProfile {
  return {
    playerId: item.playerId,
    applicantUserId: item.userId,
    displayName: item.nickname,
    playerStatus: mapPlayerStatus(item.status),
    currentRank: item.currentRank,
    elo: item.elo,
    clubIds: mapPlayerClubIds(item),
  };
}

function normalizeApplicant(
  applicant: ClubMembershipApplicantView,
): ClubApplicationView['applicant'] {
  return {
    playerId: applicant.playerId ?? '',
    applicantUserId: applicant.applicantUserId ?? undefined,
    displayName: applicant.displayName,
    playerStatus:
      applicant.playerStatus ? mapPlayerStatus(applicant.playerStatus) : undefined,
    currentRank: applicant.currentRank ?? undefined,
    elo: applicant.elo ?? undefined,
    clubIds: applicant.clubIds ?? [],
  };
}

function normalizeApplicationOptionalFields(item: ClubMembershipApplicationView) {
  return {
    message: item.message ?? '',
    reviewedBy: item.reviewedBy ?? null,
    reviewedByDisplayName: item.reviewedByDisplayName ?? null,
    reviewedAt: item.reviewedAt ?? null,
    reviewNote: item.reviewNote ?? null,
    withdrawnByPrincipalId: item.withdrawnByPrincipalId ?? null,
  };
}

export function mapClubApplicationView(
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
