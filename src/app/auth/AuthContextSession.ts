import type { CurrentSessionRoleFlags } from '@/objects/auth';

export interface AuthContextUser {
  userId: string;
  username: string;
  displayName: string;
  operatorId?: string;
  roles: CurrentSessionRoleFlags;
}

export interface AuthContextSession {
  token: string;
  user: AuthContextUser;
}
