import type {
  AuthSession,
  DemoSummary,
  GuestSession,
  LoginPayload,
  PlayerProfile,
  RegisterPayload,
  SessionInfo,
} from '../domain/models';
import { toQueryString } from '../lib/query';
import { encodeBackendOption, request, sendJson } from './http';

export interface BackendAuthPayload {
  userId: string;
  username: string;
  displayName: string;
  token?: string;
  authenticated?: boolean;
  roles: AuthSession['user']['roles'];
}

export interface ApiMessagePayload {
  message: string;
}

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

export interface CreatedPlayer {
  id: string;
  userId: string;
  nickname: string;
  elo: number;
}

export interface DemoSummaryQuery {
  variant?: 'Basic' | 'Leaderboard' | 'Appeal';
  bootstrapIfMissing?: boolean;
  refreshDerived?: boolean;
}

interface RawPlayerProfile {
  id: string;
  userId?: string;
  nickname: string;
  status?: 'Active' | 'Inactive' | 'Banned';
  elo?: number;
  boundClubIds?: string[];
  clubId?: string[];
}

function mapPlayerProfile(item: RawPlayerProfile): PlayerProfile {
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
    return sendJson<BackendAuthPayload>('/auth/login', 'POST', payload);
  },
  register(payload: RegisterPayload) {
    return sendJson<BackendAuthPayload>('/auth/register', 'POST', payload);
  },
  getAuthSession(token: string) {
    return request<BackendAuthPayload>('/auth/session', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  logout(token: string) {
    return sendJson<ApiMessagePayload>(
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
    return sendJson<CreatedPlayer>(
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
    return request<RawPlayerProfile>(`/players/me${toQueryString({ operatorId })}`).then(
      mapPlayerProfile,
    );
  },
  getPlayer(playerId: string) {
    return request<RawPlayerProfile>(`/players/${playerId}`).then(mapPlayerProfile);
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
