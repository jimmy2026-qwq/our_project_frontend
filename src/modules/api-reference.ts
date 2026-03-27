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

  const neededEndpoints = [
    {
      title: '俱乐部申请收件箱',
      path: 'GET /clubs/:clubId/applications?operatorId=:clubAdminId&status=Pending&limit=20',
      detail: '成员工作台已经有 Club Admin 收件箱原型，下一步最需要后端提供真实申请列表查询。',
    },
    {
      title: '俱乐部申请审批',
      path: 'POST /clubs/:clubId/applications/:membershipId/review',
      detail: '建议支持 approve/reject 决策、note、operatorId，前端才能把“发起申请”真正闭环到“管理员处理”。',
    },
    {
      title: '当前注册玩家身份',
      path: 'GET /players/me 或 GET /session',
      detail: '主页申请工作台现在用预置注册玩家模拟，注册/登录完成后需要真实当前用户接口替换。',
    },
    {
      title: '可申请俱乐部列表',
      path: 'GET /clubs?activeOnly=true&joinableOnly=true',
      detail: '当前主页申请工作台直接复用了公开俱乐部列表，后续建议给出更明确的可申请范围。',
    },
    {
      title: '公开赛事索引',
      path: 'GET /public/tournaments',
      detail: '公开区目前只有赛程和详情页，缺少真正的公开赛事目录页。',
    },
    {
      title: '赛事阶段元数据',
      path: 'GET /tournaments/:id/stages',
      detail: '赛事运营台现在仍有部分 stage 上下文是前端写死的，这个接口能把运营台改成真实驱动。',
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
      <div class="api-list">
        ${neededEndpoints
          .map(
            (endpoint) => `
              <article class="card api-card">
                <h3>${endpoint.title}</h3>
                <code>${endpoint.path}</code>
                <p>${endpoint.detail}</p>
              </article>
            `,
          )
          .join('')}
      </div>
    </section>
  `;
}
