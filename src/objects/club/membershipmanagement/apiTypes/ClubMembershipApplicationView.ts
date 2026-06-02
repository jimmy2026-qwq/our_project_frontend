import type { ClubApplicationStatus } from '../ClubApplicationStatus';
import type { ClubMembershipApplicantView } from './ClubMembershipApplicantView';

export interface ClubMembershipApplicationView {
  applicationId: string;
  clubId: string;
  clubName: string;
  applicant: ClubMembershipApplicantView;
  submittedAt: string;
  message: string | null;
  status: ClubApplicationStatus;
  reviewedBy: string | null;
  reviewedByDisplayName: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  withdrawnByPrincipalId: string | null;
  canReview: boolean;
  canWithdraw: boolean;
}
