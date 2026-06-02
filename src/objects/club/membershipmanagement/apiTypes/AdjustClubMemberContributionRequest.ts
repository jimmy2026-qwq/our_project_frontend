export interface AdjustClubMemberContributionRequest {
  operatorId: string;
  playerId: string;
  delta: number;
  note?: string;
}
