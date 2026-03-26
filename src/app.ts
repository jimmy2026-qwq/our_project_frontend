import { createApiReferenceSection } from './modules/api-reference';
import { createArchitectureSection } from './modules/architecture';
import { initGuestApplicationHub } from './modules/guest-application';
import { createLandingHero } from './modules/hero';
import { initMemberHub } from './modules/member-hub';
import { initPublicHall } from './modules/public-hall';
import { createRoleMatrixSection } from './modules/role-matrix';
import { initTournamentOps } from './modules/tournament-ops';
import { createWorkbenchSection } from './modules/workbench';

type AppRoute = 'blueprint' | 'public' | 'applications' | 'member-hub' | 'tournament-ops';

function getAppRoute(): AppRoute {
  const hash = window.location.hash.replace(/^#/, '');
  const segments = hash.split('/').filter(Boolean);
  const root = segments[0];

  if (!root) {
    return 'blueprint';
  }

  if (root === 'public') {
    return 'public';
  }

  if (root === 'applications') {
    return 'applications';
  }

  if (root === 'member-hub') {
    return 'member-hub';
  }

  if (root === 'tournament-ops') {
    return 'tournament-ops';
  }

  if (root === 'tournaments' || root === 'clubs') {
    return 'public';
  }

  return 'blueprint';
}

function isRouteActive(route: AppRoute, current: AppRoute) {
  return route === current ? 'app-nav__link--active' : '';
}

function createShell(route: AppRoute) {
  return `
    <div class="public-shell app-shell">
      <header class="site-header">
        <div class="site-header__brand">
          <span class="site-header__mark">R</span>
          <div>
            <strong>RiichiNexus</strong>
            <span>Frontend delivery workspace</span>
          </div>
        </div>
        <div class="site-header__status">
          <span class="site-pill">API First</span>
          <span class="site-pill">Mock Fallback</span>
        </div>
      </header>
      <main class="public-shell__content">
        <section class="app-banner">
          <div>
            <p class="eyebrow">Project Delivery</p>
            <h1>把现有页面骨架接成可演示、可继续推进的前端工作台</h1>
            <p>
              当前版本把公开大厅、匿名申请入口、成员工作台、赛事运营台和架构蓝图放进同一应用壳里，
              方便继续沿着后端接口逐步替换 mock 和扩展写操作。
            </p>
          </div>
          <nav class="app-nav" aria-label="Primary">
            <a class="app-nav__link ${isRouteActive('blueprint', route)}" href="#/">项目蓝图</a>
            <a class="app-nav__link ${isRouteActive('public', route)}" href="#/public">公开大厅</a>
            <a class="app-nav__link ${isRouteActive('applications', route)}" href="#/applications">匿名申请</a>
            <a class="app-nav__link ${isRouteActive('member-hub', route)}" href="#/member-hub">成员工作台</a>
            <a class="app-nav__link ${isRouteActive('tournament-ops', route)}" href="#/tournament-ops">赛事运营台</a>
          </nav>
        </section>
        <section id="app-route-root"></section>
      </main>
      <footer class="site-footer">
        <p>当前阶段优先落实只读公开区、匿名申请入口和后端已稳定的工作台读接口。</p>
        <a href="#/" class="site-footer__link">返回项目蓝图</a>
      </footer>
    </div>
  `;
}

function renderBlueprintHome() {
  return `
    ${createLandingHero()}
    ${createArchitectureSection()}
    ${createRoleMatrixSection()}
    ${createWorkbenchSection()}
    ${createApiReferenceSection()}
  `;
}

export async function mountApp(container: HTMLElement) {
  async function renderRoute() {
    const route = getAppRoute();
    container.innerHTML = createShell(route);

    const routeRoot = container.querySelector<HTMLElement>('#app-route-root');

    if (!routeRoot) {
      throw new Error('App route root was not found.');
    }

    if (route === 'blueprint') {
      routeRoot.innerHTML = renderBlueprintHome();
      return;
    }

    if (route === 'public') {
      await initPublicHall(routeRoot);
      return;
    }

    if (route === 'applications') {
      await initGuestApplicationHub(routeRoot);
      return;
    }

    if (route === 'member-hub') {
      await initMemberHub(routeRoot);
      return;
    }

    await initTournamentOps(routeRoot);
  }

  window.addEventListener('hashchange', () => {
    void renderRoute();
  });

  await renderRoute();
}
