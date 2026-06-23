export interface UpdateClubRecruitmentPolicyRequest {
  operatorId: string;
  applicationsOpen: boolean;
  requirementsText?: string;
  expectedReviewSlaHours?: number;
  note?: string;
}
