import { createApiReferenceSection } from './modules/api-reference';
import { createArchitectureSection } from './modules/architecture';
import { createLandingHero } from './modules/hero';
import { initHomeClubApplication } from './modules/guest-application';
import { initMemberHub } from './modules/member-hub';
import { initPublicHall } from './modules/public-hall';
import { createRoleMatrixSection } from './modules/role-matrix';
import { initTournamentOps } from './modules/tournament-ops';
import { createWorkbenchSection } from './modules/workbench';

type AppRoute = 'blueprint' | 'public' | 'member-hub' | 'tournament-ops';

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
            <span>前端交付工作台</span>
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
            <p class="eyebrow">Project Blueprint</p>
            <h1>从文档、接口契约到前端落地的项目蓝图首页</h1>
            <p>
              当前首页不再只是展示概念说明，而是把 README 中定义的模块边界、doc 目录中的接口契约、以及前端现有的
              public/member/tournament 三条主链路统一到一个入口里，方便联调、评审和继续迭代。
            </p>
          </div>
          <nav class="app-nav" aria-label="Primary">
            <a class="app-nav__link ${isRouteActive('blueprint', route)}" href="#/">项目蓝图</a>
            <a class="app-nav__link ${isRouteActive('public', route)}" href="#/public">公共大厅</a>
            <a class="app-nav__link ${isRouteActive('member-hub', route)}" href="#/member-hub">成员工作台</a>
            <a class="app-nav__link ${isRouteActive('tournament-ops', route)}" href="#/tournament-ops">赛事运营台</a>
          </nav>
        </section>
        <section id="app-route-root"></section>
      </main>
      <footer class="site-footer">
        <p>
          蓝图页聚焦“现状可交付说明”：首页应用流、公共大厅、成员工作台与赛事运营台都按照当前代码和 doc 契约对齐。
        </p>
        <a href="#/" class="site-footer__link">回到项目蓝图</a>
      </footer>
    </div>
  `;
}

function renderBlueprintHome() {
  return `
    ${createLandingHero()}
    <section id="home-club-application-root"></section>
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
      const applicationRoot = routeRoot.querySelector<HTMLElement>('#home-club-application-root');
      if (applicationRoot) {
        await initHomeClubApplication(applicationRoot);
      }
      return;
    }

    if (route === 'public') {
      await initPublicHall(routeRoot);
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
