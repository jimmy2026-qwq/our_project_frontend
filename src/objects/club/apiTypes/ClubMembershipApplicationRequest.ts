export interface ClubMembershipApplicationRequest {
  applicantUserId?: string;
  displayName: string;
  message?: string;
  guestSessionId?: string;
  operatorId?: string;
}
