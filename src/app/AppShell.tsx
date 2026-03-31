import { NavLink, Outlet } from 'react-router-dom';

const navigationItems = [
  { to: '/', label: '项目蓝图', end: true },
  { to: '/public', label: '公共大厅' },
  { to: '/member-hub', label: '成员工作台' },
  { to: '/tournament-ops', label: '赛事运营台' },
];

function getNavClassName(isActive: boolean) {
  return `app-nav__link ${isActive ? 'app-nav__link--active' : ''}`.trim();
}

export function AppShell() {
  return (
    <div className="public-shell app-shell template-app-shell">
      <header className="site-header">
        <div className="site-header__brand">
          <span className="site-header__mark">R</span>
          <div>
            <strong>RiichiNexus</strong>
            <span>前端迁移工作台</span>
          </div>
        </div>
        <div className="site-header__status">
          <span className="site-pill">React Router</span>
          <span className="site-pill">API First</span>
          <span className="site-pill">Mock Fallback</span>
        </div>
      </header>
      <main className="public-shell__content">
        <section className="app-banner">
          <div>
            <p className="eyebrow">Template Migration</p>
            <h1>把当前蓝图前端逐步迁入 template 风格的 React 架构</h1>
            <p>
              当前阶段先落 React 路由壳子，保持现有业务模块还能继续工作。接下来我们会逐步把大页面拆成
              route、page、component、hook 和 store。
            </p>
          </div>
          <nav className="app-nav" aria-label="Primary">
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
      <footer className="site-footer">
        <p>当前应用已切换到 React + Router 运行壳，后续页面会继续按 template 模式细化拆分。</p>
        <NavLink to="/" className="site-footer__link">
          回到项目蓝图
        </NavLink>
      </footer>
    </div>
  );
}
