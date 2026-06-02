import {
  CreateGuestSessionAuthAPI,
  CurrentSessionAuthAPI,
  LoginAuthAPI,
  LogoutAuthAPI,
  RegisterAuthAPI,
  RestoreAuthSessionAPI,
  RevokeGuestSessionAuthAPI,
} from '@/api/auth';
import { GetCurrentPlayerAPI } from '@/api/player';
import type { AuthSession } from '@/providers/auth/AuthSession';
import type {
  AuthSessionView,
  AuthSuccessView,
  CreateGuestSessionRequest,
  CurrentSessionQuery,
  LoginRequest,
  RegisterAccountRequest,
  CurrentSessionView,
  GuestSessionResponse,
  LogoutResponse,
} from '@/objects/auth';
import type { PlayerProfileView } from '@/objects/player';
import { sendAPI } from '@/system/api';

const AUTH_SESSION_STORAGE_KEY = 'riichi-nexus.auth.session';

interface StoredSessionRecord {
  token: string;
  user: AuthSession['user'];
}

const authApi = {
  login(payload: LoginRequest) {
    return sendAPI<AuthSuccessView>(LoginAuthAPI.fromRequest(payload));
  },
  register(payload: RegisterAccountRequest) {
    return sendAPI<AuthSuccessView>(RegisterAuthAPI.fromRequest(payload));
  },
  getAuthSession(token: string) {
    return sendAPI<AuthSessionView>(new RestoreAuthSessionAPI(token));
  },
  logout(token: string) {
    return sendAPI<LogoutResponse>(new LogoutAuthAPI(token));
  },
  getSession(filters: CurrentSessionQuery) {
    return sendAPI<CurrentSessionView>(new CurrentSessionAuthAPI(filters));
  },
  createGuestSession(payload: CreateGuestSessionRequest) {
    return sendAPI<GuestSessionResponse>(new CreateGuestSessionAuthAPI(payload));
  },
  revokeGuestSession(guestSessionId: string, reason?: string) {
    return sendAPI<GuestSessionResponse>(
      new RevokeGuestSessionAuthAPI(guestSessionId, reason),
    );
  },
};

function getCurrentPlayer(operatorId: string) {
  return sendAPI<PlayerProfileView>(new GetCurrentPlayerAPI(operatorId));
}

type BackendAuthResponse = Awaited<ReturnType<typeof authApi.login>>;
type BackendSessionResponse = Awaited<ReturnType<typeof authApi.getAuthSession>>;

function createGuestToken(guestSessionId: string) {
  return `guest:${guestSessionId}`;
}

function readGuestSessionId(token: string) {
  return token.startsWith('guest:') ? token.slice('guest:'.length) : null;
}

function persistSession(session: AuthSession | null) {
  if (!session) {
    window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    return;
  }

  const record: StoredSessionRecord = {
    token: session.token,
    user: session.user,
  };

  window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(record));
}

async function resolveOperatorId(
  response: BackendAuthResponse | BackendSessionResponse,
) {
  if (!response.roles.isRegisteredPlayer) {
    return response.userId;
  }

  try {
    const player = await getCurrentPlayer(response.userId);
    return player.playerId || response.userId;
  } catch {
    return response.userId;
  }
}

async function mapBackendAuthSession(
  response: BackendAuthResponse | BackendSessionResponse,
  tokenOverride?: string,
): Promise<AuthSession> {
  const token =
    tokenOverride ?? ('token' in response ? response.token : undefined);

  if (!token) {
    throw new Error(
      'Authenticated session token is missing from the backend response.',
    );
  }

  const operatorId = await resolveOperatorId(response);

  return {
    token,
    user: {
      userId: response.userId,
      username: response.username,
      displayName: response.displayName,
      operatorId,
      roles: response.roles,
    },
  };
}

function mapGuestSession(session: CurrentSessionView): AuthSession {
  const guestSessionId = session.guestSession?.id ?? session.principalId;

  return {
    token: createGuestToken(guestSessionId),
    user: {
      userId: guestSessionId,
      username: guestSessionId,
      displayName: session.displayName,
      roles: session.roles,
    },
  };
}

export function readPersistedSession() {
  const raw = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredSessionRecord;
  } catch {
    return null;
  }
}

export async function restoreSession(token: string) {
  const guestSessionId = readGuestSessionId(token);

  if (guestSessionId) {
    const session = await authApi.getSession({ guestSessionId });

    if (!session.authenticated) {
      persistSession(null);
      return null;
    }

    const guestAuthSession = mapGuestSession(session);
    persistSession(guestAuthSession);
    return guestAuthSession;
  }

  const session = await mapBackendAuthSession(
    await authApi.getAuthSession(token),
    token,
  );
  persistSession(session);
  return session;
}

export async function loginUser(payload: LoginRequest) {
  const loginResult = await authApi.login(payload);
  const session = await mapBackendAuthSession(
    await authApi.getAuthSession(loginResult.token),
    loginResult.token,
  );
  persistSession(session);
  return session;
}

export async function registerUser(payload: RegisterAccountRequest) {
  const registerResult = await authApi.register(payload);
  const session = await mapBackendAuthSession(
    await authApi.getAuthSession(registerResult.token),
    registerResult.token,
  );
  persistSession(session);
  return session;
}

export async function enterGuestMode(displayName = 'Guest') {
  const guestSession = await authApi.createGuestSession({ displayName });
  const session = await authApi.getSession({ guestSessionId: guestSession.id });
  const guestAuthSession = mapGuestSession(session);
  persistSession(guestAuthSession);
  return guestAuthSession;
}

export async function logoutUser(token: string) {
  const guestSessionId = readGuestSessionId(token);

  if (guestSessionId) {
    await authApi.revokeGuestSession(guestSessionId, 'guest-exit');
  } else {
    await authApi.logout(token);
  }

  persistSession(null);
}
