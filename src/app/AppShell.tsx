import { Link, Outlet, useLocation } from 'react-router-dom';

import { Button } from '@/components/ui';
import { useAuth, useNotice } from '@/hooks';

export function AppShell() {
  const location = useLocation();
  const { session, logout } = useAuth();
  const { notifyInfo } = useNotice();
  const isRegisteredPlayer = session?.user.roles.isRegisteredPlayer ?? false;

  async function handleLogout() {
    await logout();
    notifyInfo('已退出登录', '你已返回登录页，可以重新选择账号继续操作。');
  }

  return (
    <div className="public-shell app-shell template-app-shell gap-6">
      <header className="site-header flex items-center justify-between gap-4 rounded-[22px] border border-[color:var(--line)] bg-[rgba(6,17,26,0.74)] px-5 py-4 shadow-[var(--shadow-md)] backdrop-blur-[18px]">
        <div className="site-header__brand flex items-center gap-3">
          <span className="site-header__mark inline-flex h-11 w-11 items-center justify-center rounded-[15px] bg-[linear-gradient(145deg,rgba(236,197,122,0.25),rgba(114,216,209,0.2)),rgba(255,255,255,0.04)] font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            R
          </span>
          <div className="flex items-center gap-3">
            <div>
              <strong>RiichiNexus</strong>
              <span className="mt-1 block">Guest Lobby</span>
            </div>
            {isRegisteredPlayer ? (
              <Link
                to="/blueprint"
                className="inline-flex min-h-[34px] items-center rounded-full border border-[rgba(236,197,122,0.24)] bg-[rgba(255,255,255,0.04)] px-3 py-1.5 text-[0.86rem] text-[color:var(--text)] no-underline transition hover:-translate-y-px hover:border-[rgba(236,197,122,0.42)]"
              >
                项目蓝图
              </Link>
            ) : null}
          </div>
        </div>
        <div className="site-header__status flex items-center gap-3">
          {isRegisteredPlayer ? (
            <Link
              to="/me"
              className="site-pill no-underline transition hover:-translate-y-px hover:border-[rgba(236,197,122,0.42)] hover:text-[color:var(--text)]"
            >
              {session?.user.displayName ?? '匿名用户'}
            </Link>
          ) : (
            <span className="site-pill">{session?.user.displayName ?? '匿名用户'}</span>
          )}
          {session?.user.roles.isGuest ? <span className="site-pill">访客</span> : null}
          <Button variant="outline" size="sm" onClick={() => void handleLogout()}>
            退出登录
          </Button>
        </div>
      </header>

      <main className="public-shell__content grid gap-[22px]">
        <section key={location.pathname} className="template-route-root">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
