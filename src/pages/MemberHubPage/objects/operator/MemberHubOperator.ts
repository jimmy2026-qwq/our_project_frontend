import { Role } from '@/objects';

export interface MemberHubOperator {
  id: string;
  label: string;
  role: Role;
  playerId: string;
  managedClubIds: string[];
}

export const EMPTY_MEMBER_HUB_OPERATOR: MemberHubOperator = {
  id: '',
  label: '无操作身份',
  role: Role.RegisteredPlayer,
  playerId: '',
  managedClubIds: [],
};
