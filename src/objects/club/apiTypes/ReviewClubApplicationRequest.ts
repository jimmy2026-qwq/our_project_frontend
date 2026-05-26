import type { ClubApplicationReviewDecision } from './ClubApplicationReviewDecision';

export interface ReviewClubApplicationRequest {
  operatorId: string;
  decision: ClubApplicationReviewDecision;
  playerId?: string;
  note?: string;
}
