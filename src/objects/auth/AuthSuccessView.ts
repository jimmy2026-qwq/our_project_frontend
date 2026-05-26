import type { CurrentSessionRoleFlags } from './CurrentSessionRoleFlags';

export interface AuthSuccessView {
  userId: string;
  username: string;
  displayName: string;
  token: string;
  roles: CurrentSessionRoleFlags;
}
