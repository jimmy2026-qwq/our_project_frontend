import type { ClubApplicationStatus } from '../ClubApplicationStatus';

export interface ClubMembershipApplicationResponse {
  id: string;
  playerId: string | null;
  displayName: string;
  submittedAt: string;
  message: string | null;
  status: ClubApplicationStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  withdrawnByPrincipalId: string | null;
}
