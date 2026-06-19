import { Navigate, Outlet } from 'react-router-dom';

import { useAuthContext } from '@/app/auth/useAuthContext';

export function RequireRegisteredUser() {
  const { session } = useAuthContext();

  if (!session?.user.roles.isRegisteredPlayer) {
    return <Navigate replace to="/public" />;
  }

  return <Outlet />;
}
