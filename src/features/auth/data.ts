import { authApi } from '@/api/auth';
import { ApiError } from '@/api/http';
import type { AuthRoleFlags, AuthSession, AuthUser, LoginPayload, RegisterPayload, SessionInfo } from '@/domain/auth';

const AUTH_USERS_STORAGE_KEY = 'riichi-nexus.auth.users';
const AUTH_SESSION_STORAGE_KEY = 'riichi-nexus.auth.session';

interface StoredAuthUserRecord {
  userId: string;
  username: string;
  displayName: string;
  password: string;
  operatorId?: string;
  roles: AuthRoleFlags;
}

interface StoredSessionRecord {
  token: string;
  user: AuthUser;
}

type BackendAuthPayload = Awaited<ReturnType<typeof authApi.login>>;
type BackendSessionPayload = Awaited<ReturnType<typeof authApi.getAuthSession>>;

let seedUsersCache: StoredAuthUserRecord[] | null = null;
const DEFAULT_REGISTERED_DEMO_OPERATOR_ID = 'player-4';

function getRegisteredRoles(): AuthRoleFlags {
  return {
    isGuest: false,
    isRegisteredPlayer: true,
    isClubAdmin: false,
    isTournamentAdmin: false,
    isSuperAdmin: false,
  };
}

function getGuestRoles(): AuthRoleFlags {
  return {
    isGuest: true,
    isRegisteredPlayer: false,
    isClubAdmin: false,
    isTournamentAdmin: false,
    isSuperAdmin: false,
  };
}

function getSeedUsers(): StoredAuthUserRecord[] {
  return [
    {
      userId: 'mock-user-123',
      username: '123',
      displayName: 'Mock User',
      password: '456',
      operatorId: 'player-registered-1',
      roles: getRegisteredRoles(),
    },
  ];
}

async function loadSeedUsers() {
  if (seedUsersCache) {
    return seedUsersCache;
  }

  const defaultSeedUsers = getSeedUsers();

  try {
    const summary = await authApi.getDemoSummary();
    const recommendedOperatorId = summary.recommendedOperatorId?.trim();
    const preferredRegisteredOperatorId =
      recommendedOperatorId && recommendedOperatorId !== DEFAULT_REGISTERED_DEMO_OPERATOR_ID
        ? DEFAULT_REGISTERED_DEMO_OPERATOR_ID
        : recommendedOperatorId || DEFAULT_REGISTERED_DEMO_OPERATOR_ID;

    seedUsersCache = defaultSeedUsers.map((user) =>
      user.username === '123'
        ? {
            ...user,
            operatorId: preferredRegisteredOperatorId,
          }
        : user,
    );
    return seedUsersCache;
  } catch {
    seedUsersCache = defaultSeedUsers;
    return seedUsersCache;
  }
}

function createUserId(username: string) {
  return `player-${username.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'user'}`;
}

function createToken(userId: string) {
  return `local-${userId}-${Date.now()}`;
}

function createGuestToken(guestSessionId: string) {
  return `guest:${guestSessionId}`;
}

function readGuestSessionId(token: string) {
  return token.startsWith('guest:') ? token.slice('guest:'.length) : null;
}

async function readStoredUsers(): Promise<StoredAuthUserRecord[]> {
  const raw = window.localStorage.getItem(AUTH_USERS_STORAGE_KEY);
  const seededUsers = await loadSeedUsers();

  if (!raw) {
    return seededUsers;
  }

  try {
    const parsed = JSON.parse(raw) as StoredAuthUserRecord[];
    return [...seededUsers, ...parsed.filter((user) => user.username !== '123')];
  } catch {
    return seededUsers;
  }
}

function writeStoredUsers(users: StoredAuthUserRecord[]) {
  const customUsers = users.filter((user) => user.username !== '123');
  window.localStorage.setItem(AUTH_USERS_STORAGE_KEY, JSON.stringify(customUsers));
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

function shouldUseLocalFallback(error: unknown) {
  return !(error instanceof ApiError) || error.status === 404 || error.status === 501;
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

async function refreshSeedSession(record: StoredSessionRecord) {
  if (record.user.username !== '123') {
    return record;
  }

  const seedUsers = await loadSeedUsers();
  const syncedUser = seedUsers.find((user) => user.username === '123');

  if (!syncedUser || syncedUser.operatorId === record.user.operatorId) {
    return record;
  }

  const refreshedRecord: StoredSessionRecord = {
    ...record,
    user: {
      ...record.user,
      operatorId: syncedUser.operatorId,
    },
  };

  window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(refreshedRecord));
  return refreshedRecord;
}

function createFallbackSession(user: StoredAuthUserRecord): AuthSession {
  return {
    token: createToken(user.userId),
    user: {
      userId: user.userId,
      username: user.username,
      displayName: user.displayName,
      operatorId: user.operatorId,
      roles: user.roles,
    },
  };
}

function createGuestSession(displayName: string, guestSessionId: string): AuthSession {
  return {
    token: createGuestToken(guestSessionId),
    user: {
      userId: guestSessionId,
      username: guestSessionId,
      displayName,
      roles: getGuestRoles(),
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

export async function restoreSession(token: string) {
  const guestSessionId = readGuestSessionId(token);

  if (guestSessionId) {
    try {
      const session = await authApi.getSession({ guestSessionId });

      if (session.authenticated) {
        const guestAuthSession = mapGuestSession(session);
        persistSession(guestAuthSession);
        return guestAuthSession;
      }
    } catch {
      const persisted = readPersistedSession();

      if (persisted?.token === token) {
        return persisted;
      }
    }

    persistSession(null);
    return null;
  }

  try {
    const session = mapBackendAuthSession(await authApi.getAuthSession(token), token);
    persistSession(session);
    return session;
  } catch {
    const persisted = readPersistedSession();

    if (persisted?.token === token) {
      return refreshSeedSession(persisted);
    }

    persistSession(null);
    return null;
  }
}

export async function loginUser(payload: LoginPayload) {
  try {
    const session = mapBackendAuthSession(await authApi.login(payload));
    persistSession(session);
    return session;
  } catch (error) {
    if (!shouldUseLocalFallback(error)) {
      throw error;
    }

    const users = await readStoredUsers();
    const matchedUser = users.find((user) => user.username === payload.username.trim());

    if (!matchedUser || matchedUser.password !== payload.password) {
      throw new Error('用户名或密码错误。');
    }

    const session = createFallbackSession(matchedUser);
    persistSession(session);
    return session;
  }
}

export async function registerUser(payload: RegisterPayload) {
  try {
    const session = mapBackendAuthSession(await authApi.register(payload));
    persistSession(session);
    return session;
  } catch (error) {
    if (!shouldUseLocalFallback(error)) {
      throw error;
    }

    const users = await readStoredUsers();
    const username = payload.username.trim();
    const displayName = payload.displayName.trim();

    if (users.some((user) => user.username === username)) {
      throw new Error('用户名已存在，请更换后再试。');
    }

    const createdUser: StoredAuthUserRecord = {
      userId: createUserId(username),
      username,
      displayName: displayName || username,
      password: payload.password,
      operatorId: `local-${username}`,
      roles: getRegisteredRoles(),
    };

    writeStoredUsers([...users, createdUser]);

    const session = createFallbackSession(createdUser);
    persistSession(session);
    return session;
  }
}

export async function enterGuestMode(displayName = 'Guest') {
  try {
    const guestSession = await authApi.createGuestSession({ displayName });
    const session = await authApi.getSession({ guestSessionId: guestSession.id });
    const guestAuthSession = mapGuestSession(session);
    persistSession(guestAuthSession);
    return guestAuthSession;
  } catch {
    const guestAuthSession = createGuestSession(displayName, `local-${Date.now()}`);
    persistSession(guestAuthSession);
    return guestAuthSession;
  }
}

export async function logoutUser(token: string) {
  try {
    const guestSessionId = readGuestSessionId(token);

    if (guestSessionId) {
      await authApi.revokeGuestSession(guestSessionId, 'guest-exit');
    } else {
      await authApi.logout(token);
    }
  } catch {
    // Keep the local fallback usable until the backend auth contract lands.
  }

  persistSession(null);
}
