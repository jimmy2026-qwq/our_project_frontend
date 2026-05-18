import type { ClubApplicationView } from './index';

export interface ClubFilters {
  activeOnly?: boolean;
  joinableOnly?: boolean;
  memberId?: string;
  adminId?: string;
  limit?: number;
  offset?: number;
}

export interface CreateClubPayload {
  name: string;
  creatorId: string;
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

export interface AssignClubAdminPayload {
  playerId: string;
  operatorId: string;
}

export interface RemoveClubMemberPayload {
  operatorId?: string;
}
