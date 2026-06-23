import type { ClubApplication } from '@/pages/shared_objects/club/ClubApplication';

export interface TrackedClubApplicationItem {
  id: string;
  clubId: string;
  clubName: string;
  playerId: string;
  applicantName: string;
  message: string;
  status: ClubApplication['status'];
  submittedAt: string;
}
