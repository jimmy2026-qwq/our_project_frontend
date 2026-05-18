export interface AssignClubAdminPayload {
  playerId: string;
  operatorId: string;
}

export interface RemoveClubMemberPayload {
  operatorId?: string;
}
