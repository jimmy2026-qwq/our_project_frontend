import type { ClubApplicationStatus } from '../ClubApplicationStatus';

export interface ClubApplicationListQuery {
  operatorId: string;
  status?: ClubApplicationStatus;
  applicantUserId?: string;
  displayName?: string;
  limit?: number;
  offset?: number;
}
