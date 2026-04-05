import { createContext, useContext } from 'react';

import type { AuthSession, LoginPayload, RegisterPayload } from '@/domain/models';

export interface AuthContextValue {
  isReady: boolean;
  session: AuthSession | null;
  login: (payload: LoginPayload) => Promise<AuthSession>;
  register: (payload: RegisterPayload) => Promise<AuthSession>;
  enterGuestMode: (displayName?: string) => Promise<AuthSession>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider.');
  }

  return context;
}
