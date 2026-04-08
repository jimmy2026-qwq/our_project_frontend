import type {
  ClubApplication,
  ClubApplicationView,
  ClubSummary,
  ListEnvelope,
  PlayerProfile,
} from '../domain/models';
import { toQueryString } from '../lib/query';
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

export interface RawClubApplicationMutationResponse {
  id: string;
  applicantUserId?: string | null;
  displayName: string;
  submittedAt: string;
  message?: string | null;
  status: ClubApplication['status'];
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  reviewNote?: string | null;
  withdrawnByPrincipalId?: string | null;
}

interface RawClubApplicationView {
  applicationId: string;
  clubId: string;
  clubName: string;
  applicant: {
    playerId?: string[] | string;
    applicantUserId?: string[] | string;
    displayName: string;
    playerStatus?: string[] | string;
    elo?: number[] | number;
    clubIds?: string[];
  };
  submittedAt: string;
  message?: string[] | string;
  status: ClubApplicationView['status'];
  reviewedBy?: string[] | string;
  reviewedByDisplayName?: string[] | string;
  reviewedAt?: string[] | string;
  reviewNote?: string[] | string;
  withdrawnByPrincipalId?: string[] | string;
  canReview: boolean;
  canWithdraw: boolean;
}

interface RawPublicClubRelation {
  relation: 'Alliance' | 'Rivalry' | 'Neutral';
}

interface RawClub {
  id: string;
  name: string;
  members: string[];
  powerRating: number;
  treasuryBalance?: number;
  totalPoints?: number;
  pointPool?: number;
  relations?: RawPublicClubRelation[];
  dissolvedAt?: string | null;
}

interface RawClubMember {
  id: string;
  userId?: string;
  nickname: string;
  status?: 'Active' | 'Inactive' | 'Banned';
  elo?: number;
  clubId?: string[];
}

function mapClub(item: RawClub): ClubSummary {
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

function mapClubMember(item: RawClubMember): PlayerProfile {
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

function mapClubApplicationView(item: RawClubApplicationView): ClubApplicationView {
  return {
    applicationId: item.applicationId,
    clubId: item.clubId,
    clubName: item.clubName,
    applicant: {
      playerId: unwrapFirst(item.applicant.playerId) ?? '',
      applicantUserId: unwrapFirst(item.applicant.applicantUserId) ?? undefined,
      displayName: item.applicant.displayName,
      playerStatus: (unwrapFirst(item.applicant.playerStatus) as PlayerProfile['playerStatus']) ?? undefined,
      elo: unwrapFirst(item.applicant.elo) ?? undefined,
      clubIds: item.applicant.clubIds ?? [],
    },
    submittedAt: item.submittedAt,
    message: unwrapFirst(item.message) ?? '',
    status: item.status,
    reviewedBy: unwrapFirst(item.reviewedBy),
    reviewedByDisplayName: unwrapFirst(item.reviewedByDisplayName),
    reviewedAt: unwrapFirst(item.reviewedAt),
    reviewNote: unwrapFirst(item.reviewNote),
    withdrawnByPrincipalId: unwrapFirst(item.withdrawnByPrincipalId),
    canReview: item.canReview,
    canWithdraw: item.canWithdraw,
  };
}

export const clubsApi = {
  getClubs(filters: ClubFilters) {
    return request<ListEnvelope<RawClub>>(`/clubs${toQueryString(filters)}`).then((envelope) =>
      mapEnvelope(envelope, mapClub),
    );
  },
  getClubMembers(clubId: string, filters: { status?: string; nickname?: string; limit?: number; offset?: number } = {}) {
    return request<ListEnvelope<RawClubMember>>(`/clubs/${clubId}/members${toQueryString(filters)}`).then(
      (envelope) => mapEnvelope(envelope, mapClubMember),
    );
  },
  submitClubApplication(clubId: string, payload: ClubApplicationPayload) {
    return sendJson<RawClubApplicationMutationResponse>(`/clubs/${clubId}/applications`, 'POST', {
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
    return sendJson<RawClubApplicationMutationResponse>(
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
    return request<ListEnvelope<RawClubApplicationView>>(
      `/clubs/${clubId}/applications${toQueryString(filters)}`,
    ).then((envelope) => mapEnvelope(envelope, mapClubApplicationView));
  },
  getClubApplication(
    clubId: string,
    membershipId: string,
    filters: { operatorId?: string; guestSessionId?: string },
  ) {
    return request<RawClubApplicationView>(
      `/clubs/${clubId}/applications/${membershipId}${toQueryString(filters)}`,
    ).then(mapClubApplicationView);
  },
  reviewClubApplication(
    clubId: string,
    membershipId: string,
    payload: ReviewClubApplicationPayload,
  ) {
    return sendJson<RawClubApplicationView>(
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
