import { apiClient } from '../api/client';

export function createApiReferenceSection() {
  const samples = [
    {
      title: '公开排期',
      description: '游客和普通玩家都能访问，是最适合先打通的读取页面。',
      path: apiClient.buildDictionaryListPath('rank.').replace('/dictionary?', '/public/schedules?tournamentStatus=InProgress&stageStatus=Active&'),
    },
    {
      title: '排行榜',
      description: '适合验证共享分页信封 `items/total/hasMore/appliedFilters`。',
      path: '/public/leaderboards/players?clubId=club-123&status=Active&limit=20',
    },
    {
      title: '赛事桌列表',
      description: '用于赛事运营台，后面可以挂筛选器、强制重置和申诉跳转。',
      path: apiClient.buildTournamentTablesPath('tournament-123', 'stage-swiss-1', {
        status: 'WaitingPreparation',
        playerId: 'player-123',
        limit: 8,
      }),
    },
    {
      title: '玩家面板',
      description: '说明你的 dashboard 读取必须把当前操作人带进来。',
      path: '/dashboards/players/player-123?operatorId=player-123',
    },
    {
      title: '字典审计',
      description: '属于超管治理区，应该独立成后台视图，不和业务运营台混在一起。',
      path: apiClient.buildDictionaryAuditPath('rank.formula', 'player-super-admin', 'FormulaUpdated'),
    },
  ];

  return `
    <section class="section">
      <div class="section__header">
        <p class="eyebrow">4. API Mapping</p>
        <h2>后端接口对应哪些前端页面</h2>
        <p>
          你现在拿到的接口已经够做第一版骨架了。关键不是“有没有所有写接口”，
          而是先把读侧和工作台导航组织正确。
        </p>
      </div>
      <div class="api-list">
        ${samples
          .map(
            (sample) => `
              <article class="card api-card">
                <h3>${sample.title}</h3>
                <p>${sample.description}</p>
                <code>${sample.path}</code>
              </article>
            `,
          )
          .join('')}
      </div>
    </section>
  `;
}

