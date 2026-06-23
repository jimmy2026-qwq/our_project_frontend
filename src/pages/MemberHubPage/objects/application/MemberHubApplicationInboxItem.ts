import type { ClubApplicationStatus } from '@/objects';

export interface MemberHubApplicationInboxItem {
  id: string;
  clubId: string;
  clubName: string;
  playerId: string;
  applicantName: string;
  message: string;
  status: ClubApplicationStatus;
  submittedAt: string;
}
