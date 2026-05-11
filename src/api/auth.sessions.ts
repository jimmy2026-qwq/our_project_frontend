import type { GuestSession, SessionInfo } from '@/domain';
import { toQueryString } from '@/lib/query';
import type {
  CreateGuestSessionPayload,
  SessionQuery,
} from './auth.shared';
import { request, sendJson } from './http';
import {
  buildCreateGuestSessionRequest,
  buildRevokeGuestSessionRequest,
} from './auth.transport';

export const authSessionsApi = {
  getSession(filters: SessionQuery) {
    return request<SessionInfo>(`/session${toQueryString(filters)}`);
  },
  createGuestSession(payload: CreateGuestSessionPayload) {
    return sendJson<GuestSession>('/guest-sessions', 'POST', buildCreateGuestSessionRequest(payload));
  },
  getGuestSession(guestSessionId: string) {
    return request<GuestSession>(`/guest-sessions/${guestSessionId}`);
  },
  upgradeGuestSession(guestSessionId: string, playerId: string) {
    return sendJson<{ id: string; displayName: string; upgradedToPlayerId?: string }>(
      `/guest-sessions/${guestSessionId}/upgrade`,
      'POST',
      { playerId },
    );
  },
  revokeGuestSession(guestSessionId: string, reason?: string) {
    return sendJson<{ id: string; revokedAt?: string }>(
      `/guest-sessions/${guestSessionId}/revoke`,
      'POST',
      buildRevokeGuestSessionRequest(reason),
    );
  },
};
