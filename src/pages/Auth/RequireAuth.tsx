import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuthContext } from '@/app/auth/useAuthContext';

/** 路由守卫：要求存在任意有效登录或游客会话。 */
export function RequireAuth() {
  const { isReady, session } = useAuthContext();
  const location = useLocation();

  if (!isReady) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#081018] px-6 text-[#9ab0c1]">
        正在恢复登录状态...
      </div>
    );
  }

  if (!session) {
    return (
      <Navigate
        replace
        to="/login"
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <Outlet />;
}
