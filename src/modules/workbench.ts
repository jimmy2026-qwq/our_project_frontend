import { mockClubs, mockDashboards, mockLeaderboard, mockSchedules } from '../mocks/overview';

function formatLocalTime(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function createWorkbenchSection() {
  const scheduleItems = mockSchedules
    .map(
      (item) => `
        <li class="list-row">
          <div>
            <strong>${item.tournamentName}</strong>
            <span>${item.stageName}</span>
          </div>
          <div>
            <span>${item.tournamentStatus} / ${item.stageStatus}</span>
            <span>${formatLocalTime(item.scheduledAt)}</span>
          </div>
        </li>
      `,
    )
    .join('');

  const leaderboardItems = mockLeaderboard
    .map(
      (item) => `
        <li class="list-row">
          <div>
            <strong>#${item.rank} ${item.nickname}</strong>
            <span>${item.clubName}</span>
          </div>
          <div>
            <span>ELO ${item.elo}</span>
            <span>${item.status}</span>
          </div>
        </li>
      `,
    )
    .join('');

  const clubItems = mockClubs
    .map(
      (club) => `
        <li class="list-row">
          <div>
            <strong>${club.name}</strong>
            <span>${club.memberCount} members</span>
          </div>
          <div>
            <span>Power ${club.powerRating}</span>
            <span>${club.relations.join(', ')}</span>
          </div>
        </li>
      `,
    )
    .join('');

  const dashboardBlocks = mockDashboards
    .map(
      (board) => `
        <article class="card dashboard-card">
          <h3>${board.ownerType === 'player' ? 'Player Dashboard' : 'Club Dashboard'}</h3>
          <p>${board.headline}</p>
          <div class="metric-grid">
            ${board.metrics
              .map(
                (metric) => `
                  <div class="metric metric--${metric.accent ?? 'default'}">
                    <span>${metric.label}</span>
                    <strong>${metric.value}</strong>
                  </div>
                `,
              )
              .join('')}
          </div>
        </article>
      `,
    )
    .join('');

  return `
    <section class="section">
      <div class="section__header">
        <p class="eyebrow">3. Workbench</p>
        <h2>应该先做哪些页面</h2>
        <p>
          第一阶段建议只做四种“可闭环”的读页面，用它们稳定领域模型、分页约定和权限入口。
        </p>
      </div>
      <div class="workbench-grid">
        <article class="card panel-card">
          <h3>公开赛程页</h3>
          <ul class="list">${scheduleItems}</ul>
        </article>
        <article class="card panel-card">
          <h3>公共玩家排行榜</h3>
          <ul class="list">${leaderboardItems}</ul>
        </article>
        <article class="card panel-card">
          <h3>俱乐部总览</h3>
          <ul class="list">${clubItems}</ul>
        </article>
        <article class="card panel-card">
          <h3>数据面板原型</h3>
          ${dashboardBlocks}
        </article>
      </div>
    </section>
  `;
}

