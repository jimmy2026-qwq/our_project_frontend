import type { ClubApplicationStatus } from '../ClubApplicationStatus';

export interface ClubApplicationListQuery {
  operatorId: string;
  status?: ClubApplicationStatus;
  playerId?: string;
  displayName?: string;
  limit?: number;
  offset?: number;
}
