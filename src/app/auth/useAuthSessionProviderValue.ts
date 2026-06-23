import { useCallback, useEffect, useMemo, useState } from 'react';

import { AUTH_SESSION_STORAGE_KEY, persistSession, readPersistedSession } from '@/app/auth/functions/authSessionStorage';
import { restoreAuthSessionOnce } from '@/app/auth/functions/restoreAuthSessionOnce';
import type { AuthContextSession } from '@/app/auth/AuthContextSession';
import type { AuthContextValue } from '@/app/auth/useAuthContext';

export function useAuthSessionProviderValue(): AuthContextValue {
  const [session, setSession] = useState<AuthContextSession | null>(null);
  const [isReady, setIsReady] = useState(false);

  const saveSession = useCallback((nextSession: AuthContextSession) => {
    persistSession(nextSession);
    setSession(nextSession);
  }, []);

  const clearSession = useCallback(() => {
    persistSession(null);
    setSession(null);
  }, []);

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

        const nextSession = await restoreAuthSessionOnce(persisted.token);

        if (isMounted) {
          if (nextSession) {
            saveSession(nextSession);
          } else {
            clearSession();
          }
        }
      } catch {
        if (isMounted) {
          clearSession();
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
  }, [clearSession, saveSession]);

  useEffect(() => {
    function handleSessionStorageChange(event: StorageEvent) {
      if (event.key && event.key !== AUTH_SESSION_STORAGE_KEY) {
        return;
      }

      const persisted = readPersistedSession();

      setSession(
        persisted ? { token: persisted.token, user: persisted.user } : null,
      );
      setIsReady(true);
    }

    window.addEventListener('storage', handleSessionStorageChange);

    return () => {
      window.removeEventListener('storage', handleSessionStorageChange);
    };
  }, []);

  return useMemo(
    () => ({
      isReady,
      session,
      saveSession,
      clearSession,
    }),
    [clearSession, isReady, saveSession, session],
  );
}
