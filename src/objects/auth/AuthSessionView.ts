import type { CurrentSessionRoleFlags } from './CurrentSessionRoleFlags';

export interface AuthSessionView {
  userId: string;
  username: string;
  displayName: string;
  authenticated: boolean;
  roles: CurrentSessionRoleFlags;
}
