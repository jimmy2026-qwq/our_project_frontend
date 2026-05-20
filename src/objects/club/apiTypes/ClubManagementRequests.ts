export interface CreateClubRequest {
  name: string;
  creatorId: string;
}

export interface AddClubMemberRequest {
  playerId: string;
  operatorId?: string;
}

export interface AssignClubTitleRequest {
  playerId: string;
  operatorId: string;
  title: string;
  note?: string;
}

export interface ClearClubTitleRequest {
  operatorId: string;
  note?: string;
}

export interface AdjustClubTreasuryRequest {
  operatorId: string;
  delta: number;
  note?: string;
}

export interface AdjustClubPointPoolRequest {
  operatorId: string;
  delta: number;
  note?: string;
}

export interface AdjustClubMemberContributionRequest {
  operatorId: string;
  playerId: string;
  delta: number;
  note?: string;
}

export interface ClubRankNodeRequest {
  code: string;
  label: string;
  minimumContribution: number;
  privileges?: string[];
}

export interface UpdateClubRankTreeRequest {
  operatorId: string;
  ranks: ClubRankNodeRequest[];
  note?: string;
}

export interface AwardClubHonorRequest {
  operatorId: string;
  title: string;
  note?: string;
  achievedAt?: string;
}

export interface RevokeClubHonorRequest {
  operatorId: string;
  title: string;
  note?: string;
}

export interface UpdateClubRecruitmentPolicyRequest {
  operatorId: string;
  applicationsOpen: boolean;
  requirementsText?: string;
  expectedReviewSlaHours?: number;
  note?: string;
}

export interface UpdateClubRelationRequest {
  operatorId: string;
  targetClubId: string;
  relation: string;
  note?: string;
}

export interface ClubListQuery {
  activeOnly?: boolean;
  joinableOnly?: boolean;
  memberId?: string;
  adminId?: string;
  name?: string;
  limit?: number;
  offset?: number;
}

export interface ClubMemberListQuery {
  status?: string;
  nickname?: string;
  limit?: number;
  offset?: number;
}

export interface ClubMemberPrivilegeListQuery {
  playerId?: string;
  privilege?: string;
  rankCode?: string;
  limit?: number;
  offset?: number;
}

export interface RemoveClubMemberRequest {
  operatorId?: string;
}
