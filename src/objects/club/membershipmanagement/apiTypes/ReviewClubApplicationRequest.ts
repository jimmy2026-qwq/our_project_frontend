import type { ClubApplicationReviewDecision } from './ClubApplicationReviewDecision';

export interface ReviewClubApplicationRequest {
  operatorId: string;
  decision: ClubApplicationReviewDecision;
  note?: string;
}
