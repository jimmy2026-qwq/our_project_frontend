import type { PlayerProfile } from './auth';

export interface ClubApplication {
  id: string;
  clubId: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Withdrawn';
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
  status: 'Pending' | 'Approved' | 'Rejected' | 'Withdrawn';
  reviewedBy?: string | null;
  reviewedByDisplayName?: string | null;
  reviewedAt?: string | null;
  reviewNote?: string | null;
  withdrawnByPrincipalId?: string | null;
  canReview: boolean;
  canWithdraw: boolean;
}
