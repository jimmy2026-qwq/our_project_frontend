import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@/app/auth/useAuth';

export function RequireAuth() {
  const { isReady, session } = useAuth();
  const location = useLocation();

  if (!isReady) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#081018] px-6 text-[#9ab0c1]">
        姝ｅ湪鎭㈠鐧诲綍鐘舵€?..
      </div>
    );
  }

  if (!session) {
    return <Navigate replace to="/login" state={{ from: `${location.pathname}${location.search}` }} />;
  }

  return <Outlet />;
}
