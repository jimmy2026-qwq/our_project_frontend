import type { ClubApplicationStatus } from '@/objects/club';

export interface ClubApplication {
  id: string;
  clubId: string;
  status: ClubApplicationStatus;
  applicantName: string;
  message: string;
  createdAt: string;
}
