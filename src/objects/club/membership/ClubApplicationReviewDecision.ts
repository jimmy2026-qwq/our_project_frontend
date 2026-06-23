export const ClubApplicationReviewDecisions = {
  Approve: 'approve',
  Reject: 'reject',
} as const;

export type ClubApplicationReviewDecision =
  (typeof ClubApplicationReviewDecisions)[keyof typeof ClubApplicationReviewDecisions];
