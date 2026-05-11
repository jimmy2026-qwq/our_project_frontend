import type {
  ClubApplicationView,
  ClubSummary,
  PlayerProfile,
} from '@/domain';
import type {
  ClubApplicationApplicantContract,
  ClubApplicationViewContract,
  ClubContract,
  ClubMemberContract,
} from './contracts/clubs';

export interface ClubFilters {
  activeOnly?: boolean;
  joinableOnly?: boolean;
  memberId?: string;
  adminId?: string;
  limit?: number;
  offset?: number;
}

export interface ClubApplicationPayload {
  guestSessionId?: string;
  operatorId?: string;
  displayName?: string;
  message: string;
}

export interface WithdrawClubApplicationPayload {
  guestSessionId?: string;
  operatorId?: string;
  note?: string;
}

export interface ClubApplicationListFilters {
  operatorId: string;
  status?: ClubApplicationView['status'];
  applicantUserId?: string;
  displayName?: string;
  limit?: number;
  offset?: number;
}

export interface ReviewClubApplicationPayload {
  operatorId: string;
  decision: 'approve' | 'reject';
  note?: string;
  playerId?: string;
}

export interface CreateClubPayload {
  name: string;
  creatorId: string;
}

export interface AssignClubAdminPayload {
  playerId: string;
  operatorId: string;
}

export interface RemoveClubMemberPayload {
  operatorId?: string;
}

export function mapClub(item: ClubContract): ClubSummary {
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

export function mapClubMember(item: ClubMemberContract): PlayerProfile {
  return {
    playerId: item.id,
    applicantUserId: item.userId,
    displayName: item.nickname,
    playerStatus: item.status,
    elo: item.elo,
    clubIds: item.boundClubIds,
  };
}

function normalizeApplicant(applicant: ClubApplicationApplicantContract): ClubApplicationView['applicant'] {
  return {
    playerId: applicant.playerId ?? '',
    applicantUserId: applicant.applicantUserId ?? undefined,
    displayName: applicant.displayName,
    playerStatus: (applicant.playerStatus as PlayerProfile['playerStatus']) ?? undefined,
    currentRank: applicant.currentRank ?? undefined,
    elo: applicant.elo ?? undefined,
    clubIds: applicant.clubIds ?? [],
  };
}

function normalizeApplicationOptionalFields(item: ClubApplicationViewContract) {
  return {
    message: item.message ?? '',
    reviewedBy: item.reviewedBy ?? null,
    reviewedByDisplayName: item.reviewedByDisplayName ?? null,
    reviewedAt: item.reviewedAt ?? null,
    reviewNote: item.reviewNote ?? null,
    withdrawnByPrincipalId: item.withdrawnByPrincipalId ?? null,
  };
}

export function mapClubApplicationView(item: ClubApplicationViewContract): ClubApplicationView {
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
