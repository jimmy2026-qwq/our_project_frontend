import { mockClubs, mockDashboards, mockLeaderboard, mockSchedules } from '../mocks/overview';

function formatLocalTime(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

const workbenchSteps = [
  {
    title: 'Blueprint Home',
    detail: '展示架构说明，同时挂入首页入会申请工作台。',
  },
  {
    title: 'Public Hall',
    detail: '读取公开赛程、社团目录与选手榜，支持进入公开详情页。',
  },
  {
    title: 'Member Hub',
    detail: '加载 player/club dashboard 与 club applications inbox。',
  },
  {
    title: 'Tournament Ops',
    detail: '聚焦 tables / records / appeals 等赛事执行视图。',
  },
];

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
            <span>${club.relations.join(', ') || 'Neutral'}</span>
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
        <p class="eyebrow">3. Workbench Flow</p>
        <h2>首页蓝图如何串起现有前端工作流</h2>
        <p>
          这里不是做真实运营控制台，而是把当前仓库里已经落地的体验路径拼成一条“从浏览到运营”的可视化路线，帮助快速理解项目现状。
        </p>
      </div>
      <div class="workbench-steps">
        ${workbenchSteps
          .map(
            (item, index) => `
              <article class="card workbench-step-card">
                <span>0${index + 1}</span>
                <h3>${item.title}</h3>
                <p>${item.detail}</p>
              </article>
            `,
          )
          .join('')}
      </div>
      <div class="workbench-grid">
        <article class="card panel-card">
          <h3>公开赛程快照</h3>
          <ul class="list">${scheduleItems}</ul>
        </article>
        <article class="card panel-card">
          <h3>玩家榜单快照</h3>
          <ul class="list">${leaderboardItems}</ul>
        </article>
        <article class="card panel-card">
          <h3>社团目录快照</h3>
          <ul class="list">${clubItems}</ul>
        </article>
        <article class="card panel-card">
          <h3>Dashboard 预览</h3>
          ${dashboardBlocks}
        </article>
      </div>
    </section>
  `;
}
