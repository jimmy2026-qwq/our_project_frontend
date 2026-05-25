import type { ClubApplicationStatus } from './ClubApplicationStatus';

export type ClubApplicationReviewDecision = 'approve' | 'reject';

export interface ClubMembershipApplicationRequest {
  applicantUserId?: string;
  displayName: string;
  message?: string;
  guestSessionId?: string;
  operatorId?: string;
}

export interface ApproveClubApplicationRequest {
  playerId: string;
  operatorId: string;
  note?: string;
}

export interface RejectClubApplicationRequest {
  operatorId: string;
  note?: string;
}

export interface ReviewClubApplicationRequest {
  operatorId: string;
  decision: ClubApplicationReviewDecision;
  playerId?: string;
  note?: string;
}

export interface WithdrawClubApplicationRequest {
  guestSessionId?: string;
  operatorId?: string;
  note?: string;
}

export interface ClubApplicationListQuery {
  operatorId: string;
  status?: ClubApplicationStatus;
  applicantUserId?: string;
  displayName?: string;
  limit?: number;
  offset?: number;
}

export interface ClubApplicationDetailQuery {
  operatorId?: string;
  guestSessionId?: string;
}
