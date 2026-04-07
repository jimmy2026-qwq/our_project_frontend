import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

import { Button } from '@/components/ui';
import { useAuth, useNotice } from '@/hooks';

const navigationItems = [
  { to: '/', label: '项目总览', end: true, requiresRegistered: true },
  { to: '/public', label: '公共大厅', requiresRegistered: false },
  { to: '/member-hub', label: '成员工作台', requiresRegistered: true },
  { to: '/tournament-ops', label: '赛事运营台', requiresRegistered: true },
];

function getNavClassName(isActive: boolean) {
  return [
    'app-nav__link block rounded-[18px] border border-[color:var(--line)] bg-[rgba(7,18,28,0.7)] px-4 py-[14px] text-[color:var(--text)] no-underline',
    'hover:-translate-y-px hover:border-[rgba(236,197,122,0.32)]',
    isActive
      ? 'app-nav__link--active border-[color:var(--line-strong)] bg-[radial-gradient(circle_at_top_right,rgba(236,197,122,0.12),transparent_40%),linear-gradient(180deg,rgba(23,42,61,0.96),rgba(9,23,36,0.88))]'
      : '',
  ]
    .filter(Boolean)
    .join(' ');
}

export function AppShell() {
  const location = useLocation();
  const { session, logout } = useAuth();
  const { notifyInfo } = useNotice();
  const isRegisteredPlayer = session?.user.roles.isRegisteredPlayer ?? false;
  const visibleNavigationItems = navigationItems.filter(
    (item) => isRegisteredPlayer || !item.requiresRegistered,
  );

  async function handleLogout() {
    await logout();
    notifyInfo('已退出登录', '当前会话已安全结束。');
  }

  return (
    <div className="public-shell app-shell template-app-shell gap-6">
      <header className="site-header flex items-center justify-between gap-4 rounded-[22px] border border-[color:var(--line)] bg-[rgba(6,17,26,0.74)] px-5 py-4 shadow-[var(--shadow-md)] backdrop-blur-[18px]">
        <div className="site-header__brand flex items-center gap-3">
          <span className="site-header__mark inline-flex h-11 w-11 items-center justify-center rounded-[15px] bg-[linear-gradient(145deg,rgba(236,197,122,0.25),rgba(114,216,209,0.2)),rgba(255,255,255,0.04)] font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            R
          </span>
          <div>
            <strong>RiichiNexus</strong>
            <span>赛事与俱乐部管理系统</span>
          </div>
        </div>
        <div className="site-header__status flex items-center gap-3">
          <span className="site-pill">{session?.user.displayName ?? 'Anonymous'}</span>
          {session?.user.roles.isGuest ? <span className="site-pill">Guest</span> : null}
          <span className="site-pill">React Router</span>
          <span className="site-pill">API First</span>
          <span className="site-pill">Mock Fallback</span>
          <Button variant="outline" size="sm" onClick={() => void handleLogout()}>
            退出登录
          </Button>
        </div>
      </header>

      <main className="public-shell__content grid gap-[22px]">
        <section className="app-banner grid gap-6 rounded-[var(--radius-xl)] border border-[color:var(--line)] bg-[color:var(--bg-elevated)] px-[30px] py-7 shadow-[var(--shadow-md)] backdrop-blur-[18px] lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <div>
            <p className="eyebrow">Template Migration</p>
            <h1>前端已经从模板阶段迁移到基于 React Router 的页面结构。</h1>
            <p>
              现在系统会从统一入口装载，按路由切换页面，并在共享壳层里承载公共大厅、俱乐部详情、
              赛事详情和后续管理功能。
            </p>
          </div>
          <nav className="app-nav grid content-start gap-3" aria-label="Primary">
            {visibleNavigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => getNavClassName(isActive)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </section>

        <section key={location.pathname} className="template-route-root">
          <Outlet />
        </section>
      </main>

      <footer className="site-footer flex items-center justify-between gap-4 rounded-[20px] border border-[color:var(--line)] bg-[rgba(7,16,24,0.66)] px-[22px] py-[18px] shadow-[var(--shadow-md)] backdrop-blur-[18px]">
        <p>当前界面运行在统一应用壳层中，公共大厅入口会始终作为稳定返回点。</p>
        <Link
          to="/public"
          reloadDocument
          className="site-footer__link text-[color:var(--teal-strong)] no-underline hover:text-[#b2f4ef]"
        >
          返回公共大厅
        </Link>
      </footer>
    </div>
  );
}
