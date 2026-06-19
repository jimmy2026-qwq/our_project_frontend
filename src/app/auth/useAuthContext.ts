import { createContext, useContext } from 'react';

import type { AuthContextSession } from '@/app/auth/AuthContextSession';

export interface AuthContextValue {
  isReady: boolean;
  session: AuthContextSession | null;
  saveSession: (session: AuthContextSession) => void;
  clearSession: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider.');
  }

  return context;
}
