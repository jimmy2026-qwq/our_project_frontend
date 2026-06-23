export interface ClubApplicationPolicyView {
  applicationsOpen: boolean;
  requirementsText: string | null;
  expectedReviewSlaHours: number | null;
  pendingApplicationCount: number;
}
