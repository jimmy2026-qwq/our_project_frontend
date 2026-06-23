export interface ClubApplicationPolicy {
  applicationsOpen: boolean;
  requirementsText?: string | null;
  expectedReviewSlaHours?: number | null;
  pendingApplicationCount?: number;
}
