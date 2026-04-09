import type {
  DemoSummary,
  GuestSession,
  LoginPayload,
  PlayerProfile,
  RegisterPayload,
  SessionInfo,
} from '@/domain';
import { toQueryString } from '@/lib/query';
import type {
  ApiMessagePayloadContract,
  AuthSessionContract,
  AuthSuccessContract,
  CreatedPlayerContract,
  PlayerProfileContract,
} from './contracts/auth';
import { encodeBackendOption, request, sendJson } from './http';

export interface SessionQuery {
  operatorId?: string;
  guestSessionId?: string;
}

export interface CreateGuestSessionPayload {
  displayName: string;
}

export interface CreatePlayerPayload {
  userId: string;
  nickname: string;
  rankPlatform: string;
  tier: string;
  stars?: number;
  initialElo?: number;
}

export interface DemoSummaryQuery {
  variant?: 'Basic' | 'Leaderboard' | 'Appeal';
  bootstrapIfMissing?: boolean;
  refreshDerived?: boolean;
}

function mapPlayerProfile(item: PlayerProfileContract): PlayerProfile {
  return {
    playerId: item.id,
    applicantUserId: item.userId,
    displayName: item.nickname,
    playerStatus: item.status,
    elo: item.elo,
    clubIds: item.boundClubIds ?? item.clubId ?? [],
  };
}

export const authApi = {
  login(payload: LoginPayload) {
    return sendJson<AuthSuccessContract>('/auth/login', 'POST', payload);
  },
  register(payload: RegisterPayload) {
    return sendJson<AuthSuccessContract>('/auth/register', 'POST', payload);
  },
  getAuthSession(token: string) {
    return request<AuthSessionContract>('/auth/session', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  logout(token: string) {
    return sendJson<ApiMessagePayloadContract>(
      '/auth/logout',
      'POST',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  },
  getSession(filters: SessionQuery) {
    return request<SessionInfo>(`/session${toQueryString(filters)}`);
  },
  createGuestSession(payload: CreateGuestSessionPayload) {
    return sendJson<GuestSession>('/guest-sessions', 'POST', {
      displayName: encodeBackendOption(payload.displayName),
      ttlHours: [],
      deviceFingerprint: [],
    });
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
      { reason: encodeBackendOption(reason) },
    );
  },
  createPlayer(payload: CreatePlayerPayload) {
    return sendJson<CreatedPlayerContract>(
      '/players',
      'POST',
      {
        userId: payload.userId,
        nickname: payload.nickname,
        rankPlatform: payload.rankPlatform,
        tier: payload.tier,
        stars: encodeBackendOption(payload.stars),
        initialElo: payload.initialElo ?? 1500,
      },
    );
  },
  getCurrentPlayer(operatorId: string) {
    return request<PlayerProfileContract>(`/players/me${toQueryString({ operatorId })}`).then(
      mapPlayerProfile,
    );
  },
  getPlayer(playerId: string) {
    return request<PlayerProfileContract>(`/players/${playerId}`).then(mapPlayerProfile);
  },
  getDemoSummary(filters: DemoSummaryQuery = {}) {
    return request<DemoSummary>(
      `/demo/summary${toQueryString({
        variant: filters.variant ?? 'Basic',
        bootstrapIfMissing: filters.bootstrapIfMissing ?? true,
        refreshDerived: filters.refreshDerived ?? true,
      })}`,
    );
  },
};
