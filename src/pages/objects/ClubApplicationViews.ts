import type { PlayerProfile } from './PlayerProfile';
import type { ClubApplicationStatus } from '@/objects/club/apiTypes';

export interface ClubApplication {
  id: string;
  clubId: string;
  status: ClubApplicationStatus;
  applicantName: string;
  message: string;
  createdAt: string;
  guestSessionId?: string;
}

export interface ClubApplicationView {
  applicationId: string;
  clubId: string;
  clubName: string;
  applicant: PlayerProfile;
  submittedAt: string;
  message: string;
  status: ClubApplicationStatus;
  reviewedBy?: string | null;
  reviewedByDisplayName?: string | null;
  reviewedAt?: string | null;
  reviewNote?: string | null;
  withdrawnByPrincipalId?: string | null;
  canReview: boolean;
  canWithdraw: boolean;
}
