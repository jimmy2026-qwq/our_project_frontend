import type { ClubApplicationStatus } from '@/objects/club';

import type { PlayerProfile } from '@/pages/shared_objects/player/PlayerProfile';

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
