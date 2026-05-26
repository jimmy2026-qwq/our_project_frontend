import type { CurrentSessionGuestSessionView } from '../CurrentSessionGuestSessionView';
import type { CurrentSessionPlayerView } from '../CurrentSessionPlayerView';
import type { CurrentSessionRoleFlags } from '../CurrentSessionRoleFlags';
import type { SessionPrincipalKind } from '../SessionPrincipalKind';

export interface CurrentSessionResponse {
  principalKind: SessionPrincipalKind;
  principalId: string;
  displayName: string;
  authenticated: boolean;
  roles: CurrentSessionRoleFlags;
  player: CurrentSessionPlayerView | null;
  guestSession: CurrentSessionGuestSessionView | null;
}
