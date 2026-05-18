import type { ListEnvelope } from '@/objects';
import { toQueryString } from '@/lib/query';
import type {
  ClubApplicationListFilters,
  ClubApplicationPayload,
  ClubApplicationMutationResponseContract,
  ClubApplicationViewContract,
  ReviewClubApplicationPayload,
  WithdrawClubApplicationPayload,
} from '@/objects/club';
import { request, sendJson, mapEnvelope } from '../shared/http';
import {
  buildReviewClubApplicationRequest,
  buildSubmitClubApplicationRequest,
  buildWithdrawClubApplicationRequest,
} from './transport';
import { mapClubApplicationView } from './mappers';

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
