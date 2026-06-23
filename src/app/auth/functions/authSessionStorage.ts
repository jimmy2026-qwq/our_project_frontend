import type { AuthContextSession } from '@/app/auth/AuthContextSession';

export const AUTH_SESSION_STORAGE_KEY = 'riichi-nexus.auth.session';
const GUEST_SESSION_TOKEN_PREFIX = 'guest:';

export interface StoredAuthSessionRecord {
  token: string;
  user: AuthContextSession['user'];
}

export function createGuestToken(guestSessionId: string) {
  return GUEST_SESSION_TOKEN_PREFIX + guestSessionId;
}

export function readGuestSessionId(token: string) {
  return token.startsWith(GUEST_SESSION_TOKEN_PREFIX)
    ? token.slice(GUEST_SESSION_TOKEN_PREFIX.length)
    : null;
}

export function persistSession(session: AuthContextSession | null) {
  if (!session) {
    window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    return;
  }

  const record: StoredAuthSessionRecord = {
    token: session.token,
    user: session.user,
  };

  window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(record));
}

export function readPersistedSession() {
  const raw = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredAuthSessionRecord;
  } catch {
    return null;
  }
}
