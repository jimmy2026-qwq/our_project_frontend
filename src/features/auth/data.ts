import { authApi } from '@/api/auth';
import type { AuthSession, LoginPayload, RegisterPayload, SessionInfo } from '@/domain/auth';

const AUTH_SESSION_STORAGE_KEY = 'riichi-nexus.auth.session';

interface StoredSessionRecord {
  token: string;
  user: AuthSession['user'];
}

type BackendAuthPayload = Awaited<ReturnType<typeof authApi.login>>;
type BackendSessionPayload = Awaited<ReturnType<typeof authApi.getAuthSession>>;

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

function mapBackendAuthSession(payload: BackendAuthPayload | BackendSessionPayload, tokenOverride?: string): AuthSession {
  const token = tokenOverride ?? ('token' in payload ? payload.token : undefined);

  if (!token) {
    throw new Error('Authenticated session token is missing from the backend response.');
  }

  return {
    token,
    user: {
      userId: payload.userId,
      username: payload.username,
      displayName: payload.displayName,
      operatorId: payload.userId,
      roles: payload.roles,
    },
  };
}

function mapGuestSession(session: SessionInfo): AuthSession {
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

  const session = mapBackendAuthSession(await authApi.getAuthSession(token), token);
  persistSession(session);
  return session;
}

export async function loginUser(payload: LoginPayload) {
  const loginResult = await authApi.login(payload);
  const session = mapBackendAuthSession(await authApi.getAuthSession(loginResult.token), loginResult.token);
  persistSession(session);
  return session;
}

export async function registerUser(payload: RegisterPayload) {
  const registerResult = await authApi.register(payload);
  const session = mapBackendAuthSession(await authApi.getAuthSession(registerResult.token), registerResult.token);
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
