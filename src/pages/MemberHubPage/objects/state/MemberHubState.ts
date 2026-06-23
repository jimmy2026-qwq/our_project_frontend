export interface MemberHubState {
  operatorId: string;
  playerId: string;
  clubId: string;
}

export const DEFAULT_MEMBER_HUB_STATE: MemberHubState = {
  operatorId: '',
  playerId: '',
  clubId: '',
};
