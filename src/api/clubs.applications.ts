import type { ListEnvelope } from '@/domain';
import { toQueryString } from '@/lib/query';
import type {
  ClubApplicationMutationResponseContract,
  ClubApplicationViewContract,
} from './contracts/clubs';
import { request, sendJson, mapEnvelope } from './http';
import {
  buildReviewClubApplicationRequest,
  buildSubmitClubApplicationRequest,
  buildWithdrawClubApplicationRequest,
} from './clubs.transport';
import {
  type ClubApplicationListFilters,
  type ClubApplicationPayload,
  type ReviewClubApplicationPayload,
  type WithdrawClubApplicationPayload,
  mapClubApplicationView,
} from './clubs.shared';

export const clubsApplicationsApi = {
  submitClubApplication(clubId: string, payload: ClubApplicationPayload) {
    return sendJson<ClubApplicationMutationResponseContract>(
      `/clubs/${clubId}/applications`,
      'POST',
      buildSubmitClubApplicationRequest(payload),
    );
  },
  withdrawClubApplication(
    clubId: string,
    membershipId: string,
    payload: WithdrawClubApplicationPayload,
  ) {
    return sendJson<ClubApplicationMutationResponseContract>(
      `/clubs/${clubId}/applications/${membershipId}/withdraw`,
      'POST',
      buildWithdrawClubApplicationRequest(payload),
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
  getCurrentClubApplication(
    clubId: string,
    filters: { operatorId?: string; guestSessionId?: string },
  ) {
    return request<ClubApplicationViewContract>(
      `/clubs/${clubId}/applications/current${toQueryString(filters)}`,
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
      buildReviewClubApplicationRequest(payload),
    ).then(mapClubApplicationView);
  },
};
