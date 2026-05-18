import { encodeBackendOption } from '../shared/backend-option.transport';
import type {
  ClubApplicationPayload,
  RemoveClubMemberPayload,
  ReviewClubApplicationPayload,
  WithdrawClubApplicationPayload,
} from '@/objects/club';

export function buildRemoveClubMemberRequest(payload: RemoveClubMemberPayload) {
  return {
    operatorId: encodeBackendOption(payload.operatorId),
  };
}

export function buildSubmitClubApplicationRequest(payload: ClubApplicationPayload) {
  return {
    applicantUserId: encodeBackendOption<string>(undefined),
    displayName: payload.displayName,
    message: encodeBackendOption(payload.message),
    guestSessionId: encodeBackendOption(payload.guestSessionId),
    operatorId: encodeBackendOption(payload.operatorId),
  };
}

export function buildWithdrawClubApplicationRequest(payload: WithdrawClubApplicationPayload) {
  return {
    guestSessionId: encodeBackendOption(payload.guestSessionId),
    operatorId: encodeBackendOption(payload.operatorId),
    note: encodeBackendOption(payload.note),
  };
}

export function buildReviewClubApplicationRequest(payload: ReviewClubApplicationPayload) {
  return {
    operatorId: payload.operatorId,
    decision: payload.decision,
    note: encodeBackendOption(payload.note),
    playerId: encodeBackendOption(payload.playerId),
  };
}
