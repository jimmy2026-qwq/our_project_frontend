import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/hooks';

export function RequireRegisteredUser() {
  const { session } = useAuth();

  if (!session?.user.roles.isRegisteredPlayer) {
    return <Navigate replace to="/public" />;
  }

  return <Outlet />;
}
