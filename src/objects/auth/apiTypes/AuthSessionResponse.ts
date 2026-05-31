import type { CurrentSessionRoleFlags } from './CurrentSessionRoleFlags';

export interface AuthSessionResponse {
  userId: string;
  username: string;
  displayName: string;
  authenticated: boolean;
  roles: CurrentSessionRoleFlags;
}
