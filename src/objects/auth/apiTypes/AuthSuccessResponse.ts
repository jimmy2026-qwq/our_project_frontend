import type { CurrentSessionRoleFlags } from './CurrentSessionRoleFlags';

export interface AuthSuccessResponse {
  userId: string;
  username: string;
  displayName: string;
  token: string;
  roles: CurrentSessionRoleFlags;
}
