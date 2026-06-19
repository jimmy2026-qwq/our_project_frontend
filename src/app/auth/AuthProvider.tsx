import type { ReactNode } from 'react';

import { AuthContext } from '@/app/auth/useAuthContext';
import { useAuthSessionProviderValue } from '@/app/auth/useAuthSessionProviderValue';

export function AuthProvider({ children }: { children: ReactNode }) {
  const value = useAuthSessionProviderValue();

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
