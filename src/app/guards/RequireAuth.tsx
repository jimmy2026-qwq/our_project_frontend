import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@/hooks';

export function RequireAuth() {
  const { isReady, session } = useAuth();
  const location = useLocation();

  if (!isReady) {
    return (
      <div className="grid min-h-screen place-items-center bg-[color:var(--bg)] px-6 text-[color:var(--muted)]">
        姝ｅ湪鎭㈠鐧诲綍鐘舵€?..
      </div>
    );
  }

  if (!session) {
    return <Navigate replace to="/login" state={{ from: `${location.pathname}${location.search}` }} />;
  }

  return <Outlet />;
}
