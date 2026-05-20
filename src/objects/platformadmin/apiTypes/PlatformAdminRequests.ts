export interface BanPlayerRequest {
  operatorId: string;
  reason: string;
}

export interface GrantSuperAdminRequest {
  operatorId: string;
}

export interface DissolveClubRequest {
  operatorId: string;
}
