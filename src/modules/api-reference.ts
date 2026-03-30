import { apiClient } from '../api/client';

const sampleRequests = [
  {
    title: 'Public schedules',
    description: '公共大厅首页直接读取公开赛程，不再依赖旧的 /demo/summary。',
    path: '/public/schedules?tournamentStatus=InProgress&stageStatus=Active',
  },
  {
    title: 'Public clubs',
    description: '公开社团目录和详情由 public contracts 驱动，前端会在 client 层做字段适配。',
    path: '/public/clubs',
  },
  {
    title: 'Player leaderboard',
    description: '选手榜单支持按 club/status 过滤，适合公共大厅与排行榜视图复用。',
    path: '/public/leaderboards/players?status=Active&limit=20',
  },
  {
    title: 'Club applications inbox',
    description: '社团管理员在 member hub 侧查看待审核申请，是当前读写链路的核心接口之一。',
    path: 'GET /clubs/:clubId/applications?operatorId=:clubAdminId&status=Pending&limit=20',
  },
  {
    title: 'Tournament tables',
    description: '赛事运营页围绕 tables/records/appeals 组织数据，table 列表是最关键入口。',
    path: apiClient.buildTournamentTablesPath('tournament-123', 'stage-demo-swiss', {
      status: 'WaitingPreparation',
      limit: 8,
    }),
  },
  {
    title: 'Player dashboard',
    description: '成员工作台读取玩家 dashboard，并在必要时回退到 mock。',
    path: '/dashboards/players/player-123?operatorId=player-123',
  },
];

const contractChecklist = [
  {
    title: '当前前端正在使用的公共接口',
    detail:
      'README 明确指出首页 public hall 现以 /public/schedules、/public/clubs、/public/leaderboards/players 为核心。',
  },
  {
    title: '首页入会流的后端路径',
    detail:
      'GET /clubs + GET /players/me + POST /clubs/:clubId/applications + withdraw 路径，是 blueprint home 最重要的交互链路。',
  },
  {
    title: '需要保留的 normalization',
    detail:
      'public payload 字段和前端 view model 不是一一对应，src/api/client.ts 的映射逻辑不能在重构里丢掉。',
  },
  {
    title: '仍有价值但不是首页主驱动的 demo 接口',
    detail:
      'demo/summary、demo/widgets 依旧有用，更适合概览卡片、演示动作栏和 presenter 模式，而不是直接驱动当前 public hall 首页。',
  },
];

export function createApiReferenceSection() {
  return `
    <section class="section">
      <div class="section__header">
        <p class="eyebrow">4. API Mapping</p>
        <h2>蓝图页把 README 和接口文档映射成了哪些前端能力</h2>
        <p>
          这一段不追求穷举全部 API，而是把当前首页蓝图和几个主业务页真正依赖的接口摘出来，帮助后续联调时快速定位。
        </p>
      </div>
      <div class="api-list">
        ${sampleRequests
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
        ${contractChecklist
          .map(
            (item) => `
              <article class="card api-card api-card--note">
                <h3>${item.title}</h3>
                <p>${item.detail}</p>
              </article>
            `,
          )
          .join('')}
      </div>
    </section>
  `;
}
