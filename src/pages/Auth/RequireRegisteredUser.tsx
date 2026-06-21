import { Navigate, Outlet } from 'react-router-dom';

import { useAuthContext } from '@/app/auth/useAuthContext';

/** 路由守卫：仅允许已登录且已注册玩家访问子路由。 */
export function RequireRegisteredUser() {
  const { session } = useAuthContext();

  if (!session?.user.roles.isRegisteredPlayer) {
    return <Navigate replace to="/public" />;
  }

  return <Outlet />;
}
