import { initPublicHall } from './modules/public-hall';

export function createApp() {
  return `
    <div class="public-shell">
      <header class="site-header">
        <div class="site-header__brand">
          <span class="site-header__mark">R</span>
          <div>
            <strong>RiichiNexus</strong>
            <span>Guest Portal / Read-only hall</span>
          </div>
        </div>
        <div class="site-header__status">
          <span class="site-pill">Guest</span>
          <span class="site-pill">Read Only</span>
        </div>
      </header>
      <main class="public-shell__content">
        <section id="public-hall-root"></section>
      </main>
      <footer class="site-footer">
        <p>游客模式下可查看赛事、俱乐部和排行榜概览，但不会展示任何编辑入口。</p>
        <a href="#/" class="site-footer__link">返回首页</a>
      </footer>
    </div>
  `;
}

export async function mountApp(container: HTMLElement) {
  container.innerHTML = createApp();

  const publicHallRoot = container.querySelector<HTMLElement>('#public-hall-root');

  if (!publicHallRoot) {
    throw new Error('Public hall root was not found.');
  }

  await initPublicHall(publicHallRoot);
}
