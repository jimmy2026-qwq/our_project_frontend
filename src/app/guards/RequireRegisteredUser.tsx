import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/app/auth/useAuth';

export function RequireRegisteredUser() {
  const { session } = useAuth();

  if (!session?.user.roles.isRegisteredPlayer) {
    return <Navigate replace to="/public" />;
  }

  return <Outlet />;
}
