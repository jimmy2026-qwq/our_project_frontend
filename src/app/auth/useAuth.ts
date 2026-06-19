import { useAuthContext } from '@/app/auth/auth-context';

export function useAuth() {
  return useAuthContext();
}
