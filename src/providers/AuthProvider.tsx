import { useEffect, useMemo, useState, type ReactNode } from 'react';

import type { AuthSession, LoginPayload, RegisterPayload } from '@/domain/models';
import { enterGuestMode, loginUser, logoutUser, readPersistedSession, registerUser, restoreSession } from '@/features/auth/data';
import { AuthContext } from '@/providers/auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      const persisted = readPersistedSession();

      if (!persisted) {
        if (isMounted) {
          setIsReady(true);
        }
        return;
      }

      const nextSession = await restoreSession(persisted.token);

      if (isMounted) {
        setSession(nextSession);
        setIsReady(true);
      }
    }

    void bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  async function login(payload: LoginPayload) {
    const nextSession = await loginUser(payload);
    setSession(nextSession);
    return nextSession;
  }

  async function register(payload: RegisterPayload) {
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
      login,
      register,
      enterGuestMode: loginAsGuest,
      logout,
    }),
    [isReady, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
