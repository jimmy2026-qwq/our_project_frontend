import { NavLink, Outlet } from 'react-router-dom';

const navigationItems = [
  { to: '/', label: '项目蓝图', end: true },
  { to: '/public', label: '公共大厅' },
  { to: '/member-hub', label: '成员工作台' },
  { to: '/tournament-ops', label: '赛事运营台' },
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
  return (
    <div className="public-shell app-shell template-app-shell gap-6">
      <header className="site-header flex items-center justify-between gap-4 rounded-[22px] border border-[color:var(--line)] bg-[rgba(6,17,26,0.74)] px-5 py-4 shadow-[var(--shadow-md)] backdrop-blur-[18px]">
        <div className="site-header__brand flex items-center gap-3">
          <span className="site-header__mark inline-flex h-11 w-11 items-center justify-center rounded-[15px] bg-[linear-gradient(145deg,rgba(236,197,122,0.25),rgba(114,216,209,0.2)),rgba(255,255,255,0.04)] font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">R</span>
          <div>
            <strong>RiichiNexus</strong>
            <span>前端迁移工作台</span>
          </div>
        </div>
        <div className="site-header__status flex items-center gap-3">
          <span className="site-pill">React Router</span>
          <span className="site-pill">API First</span>
          <span className="site-pill">Mock Fallback</span>
        </div>
      </header>
      <main className="public-shell__content grid gap-[22px]">
        <section className="app-banner grid gap-6 rounded-[var(--radius-xl)] border border-[color:var(--line)] bg-[color:var(--bg-elevated)] px-[30px] py-7 shadow-[var(--shadow-md)] backdrop-blur-[18px] lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <div>
            <p className="eyebrow">Template Migration</p>
            <h1>把当前蓝图前端逐步迁入 template 风格的 React 架构</h1>
            <p>
              当前阶段先落 React 路由壳子，保持现有业务模块还能继续工作。接下来我们会逐步把大页面拆成
              route、page、component、hook 和 store。
            </p>
          </div>
          <nav className="app-nav grid content-start gap-3" aria-label="Primary">
            {navigationItems.map((item) => (
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
        <section className="template-route-root">
          <Outlet />
        </section>
      </main>
      <footer className="site-footer flex items-center justify-between gap-4 rounded-[20px] border border-[color:var(--line)] bg-[rgba(7,16,24,0.66)] px-[22px] py-[18px] shadow-[var(--shadow-md)] backdrop-blur-[18px]">
        <p>当前应用已切换到 React + Router 运行壳，后续页面会继续按 template 模式细化拆分。</p>
        <NavLink to="/" className="site-footer__link text-[color:var(--teal-strong)] no-underline hover:text-[#b2f4ef]">
          回到项目蓝图
        </NavLink>
      </footer>
    </div>
  );
}
