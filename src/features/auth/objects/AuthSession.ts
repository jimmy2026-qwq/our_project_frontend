import type { CurrentSessionRoleFlags } from '@/objects/auth/apiTypes';

export type AuthRoleFlags = CurrentSessionRoleFlags;

export interface AuthUser {
  userId: string;
  username: string;
  displayName: string;
  operatorId?: string;
  roles: AuthRoleFlags;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}
