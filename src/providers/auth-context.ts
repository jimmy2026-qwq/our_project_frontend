import { createContext, useContext } from 'react';

import type { LoginRequest, RegisterAccountRequest } from '@/objects/auth';
import type { AuthSession } from '@/providers/auth/AuthSession';

export interface AuthContextValue {
  isReady: boolean;
  session: AuthSession | null;
  login: (payload: LoginRequest) => Promise<AuthSession>;
  register: (payload: RegisterAccountRequest) => Promise<AuthSession>;
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
