import type {
  ClubApplicationView,
  ClubSummary,
  ListEnvelope,
  PlayerProfile,
} from '@/domain';
import { toQueryString } from '@/lib/query';
import type {
  ClubApplicationMutationResponseContract,
  ClubApplicationViewContract,
  ClubApplicationApplicantContract,
  ClubContract,
  ClubMemberContract,
} from './contracts/clubs';
import { encodeBackendOption, mapEnvelope, request, sendJson } from './http';

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

function mapClub(item: ClubContract): ClubSummary {
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

function mapClubMember(item: ClubMemberContract): PlayerProfile {
  return {
    playerId: item.id,
    applicantUserId: item.userId,
    displayName: item.nickname,
    playerStatus: item.status,
    elo: item.elo,
    clubIds: item.clubId ?? [],
  };
}

function unwrapFirst<T>(value?: T[] | T | null): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function normalizeApplicant(applicant: ClubApplicationApplicantContract): ClubApplicationView['applicant'] {
  return {
    playerId: unwrapFirst(applicant.playerId) ?? '',
    applicantUserId: unwrapFirst(applicant.applicantUserId) ?? undefined,
    displayName: applicant.displayName,
    playerStatus:
      (unwrapFirst(applicant.playerStatus) as PlayerProfile['playerStatus']) ?? undefined,
    currentRank: unwrapFirst(applicant.currentRank) ?? undefined,
    elo: unwrapFirst(applicant.elo) ?? undefined,
    clubIds: applicant.clubIds ?? [],
  };
}

function normalizeApplicationOptionalFields(item: ClubApplicationViewContract) {
  return {
    message: unwrapFirst(item.message) ?? '',
    reviewedBy: unwrapFirst(item.reviewedBy),
    reviewedByDisplayName: unwrapFirst(item.reviewedByDisplayName),
    reviewedAt: unwrapFirst(item.reviewedAt),
    reviewNote: unwrapFirst(item.reviewNote),
    withdrawnByPrincipalId: unwrapFirst(item.withdrawnByPrincipalId),
  };
}

function mapClubApplicationView(item: ClubApplicationViewContract): ClubApplicationView {
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

export const clubsApi = {
  getClubs(filters: ClubFilters) {
    return request<ListEnvelope<ClubContract>>(`/clubs${toQueryString(filters)}`).then((envelope) =>
      mapEnvelope(envelope, mapClub),
    );
  },
  getClubMembers(clubId: string, filters: { status?: string; nickname?: string; limit?: number; offset?: number } = {}) {
    return request<ListEnvelope<ClubMemberContract>>(`/clubs/${clubId}/members${toQueryString(filters)}`).then(
      (envelope) => mapEnvelope(envelope, mapClubMember),
    );
  },
  submitClubApplication(clubId: string, payload: ClubApplicationPayload) {
    return sendJson<ClubApplicationMutationResponseContract>(`/clubs/${clubId}/applications`, 'POST', {
      applicantUserId: encodeBackendOption(undefined),
      displayName: payload.displayName,
      message: encodeBackendOption(payload.message),
      guestSessionId: encodeBackendOption(payload.guestSessionId),
      operatorId: encodeBackendOption(payload.operatorId),
    });
  },
  withdrawClubApplication(
    clubId: string,
    membershipId: string,
    payload: WithdrawClubApplicationPayload,
  ) {
    return sendJson<ClubApplicationMutationResponseContract>(
      `/clubs/${clubId}/applications/${membershipId}/withdraw`,
      'POST',
      {
        guestSessionId: encodeBackendOption(payload.guestSessionId),
        operatorId: encodeBackendOption(payload.operatorId),
        note: encodeBackendOption(payload.note),
      },
    );
  },
  getClubApplications(clubId: string, filters: ClubApplicationListFilters) {
    return request<ListEnvelope<ClubApplicationViewContract>>(
      `/clubs/${clubId}/applications${toQueryString(filters)}`,
    ).then((envelope) => mapEnvelope(envelope, mapClubApplicationView));
  },
  getClubApplication(
    clubId: string,
    membershipId: string,
    filters: { operatorId?: string; guestSessionId?: string },
  ) {
    return request<ClubApplicationViewContract>(
      `/clubs/${clubId}/applications/${membershipId}${toQueryString(filters)}`,
    ).then(mapClubApplicationView);
  },
  reviewClubApplication(
    clubId: string,
    membershipId: string,
    payload: ReviewClubApplicationPayload,
  ) {
    return sendJson<ClubApplicationViewContract>(
      `/clubs/${clubId}/applications/${membershipId}/review`,
      'POST',
      {
        operatorId: payload.operatorId,
        decision: payload.decision,
        note: encodeBackendOption(payload.note),
        playerId: encodeBackendOption(payload.playerId),
      },
    ).then(mapClubApplicationView);
  },
};
