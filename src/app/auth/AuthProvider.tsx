import { useEffect, useMemo, useState, type ReactNode } from 'react';

import type {
  BootstrapSuperAdminRequest,
  LoginRequest,
  RegisterAccountRequest,
} from '@/objects/auth';
import type { AuthSession } from '@/app/auth/AuthSession';
import {
  bootstrapSuperAdminUser,
  enterGuestMode,
  loginUser,
  logoutUser,
  readPersistedSession,
  registerUser,
  restoreSession,
} from '@/app/auth/data';
import { AuthContext } from '@/app/auth/auth-context';

let pendingRestoreToken: string | null = null;
let pendingRestorePromise: Promise<AuthSession | null> | null = null;
const authSessionStorageKey = 'riichi-nexus.auth.session';

function restoreSessionOnce(token: string) {
  if (pendingRestorePromise && pendingRestoreToken === token) {
    return pendingRestorePromise;
  }

  pendingRestoreToken = token;
  pendingRestorePromise = restoreSession(token).finally(() => {
    pendingRestoreToken = null;
    pendingRestorePromise = null;
  });

  return pendingRestorePromise;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      try {
        const persisted = readPersistedSession();

        if (!persisted) {
          if (isMounted) {
            setIsReady(true);
          }
          return;
        }

        const nextSession = await restoreSessionOnce(persisted.token);

        if (isMounted) {
          setSession(nextSession);
        }
      } catch {
        if (isMounted) {
          setSession(null);
        }
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    }

    void bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    function handleSessionStorageChange(event: StorageEvent) {
      if (event.key && event.key !== authSessionStorageKey) {
        return;
      }

      const persisted = readPersistedSession();

      setSession(persisted ? { token: persisted.token, user: persisted.user } : null);
      setIsReady(true);
    }

    window.addEventListener('storage', handleSessionStorageChange);

    return () => {
      window.removeEventListener('storage', handleSessionStorageChange);
    };
  }, []);

  async function bootstrapSuperAdmin(payload: BootstrapSuperAdminRequest) {
    const nextSession = await bootstrapSuperAdminUser(payload);
    setSession(nextSession);
    return nextSession;
  }

  async function login(payload: LoginRequest) {
    const nextSession = await loginUser(payload);
    setSession(nextSession);
    return nextSession;
  }

  async function register(payload: RegisterAccountRequest) {
    const nextSession = await registerUser(payload);
    setSession(nextSession);
    return nextSession;
  }

  async function loginAsGuest(displayName?: string) {
    const nextSession = await enterGuestMode(displayName);
    setSession(nextSession);
    return nextSession;
  }

  async function logout() {
    if (session) {
      await logoutUser(session.token);
    }

    setSession(null);
  }

  const value = useMemo(
    () => ({
      isReady,
      session,
      bootstrapSuperAdmin,
      login,
      register,
      enterGuestMode: loginAsGuest,
      logout,
    }),
    [isReady, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
