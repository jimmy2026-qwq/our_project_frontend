import type { FeatureModule } from '../domain/models';

export const featureModules: FeatureModule[] = [
  {
    id: 'public-hall',
    title: 'Public Hall',
    summary:
      '游客入口与公开展示面，负责赛程、社团目录、选手榜单以及公开详情页，是当前 guest/registered player 最先触达的浏览层。',
    entities: ['Tournament', 'Stage', 'Club', 'Registered Player'],
    primaryRoles: ['Guest', 'RegisteredPlayer'],
    routes: ['#/public', '#/public/tournaments/:id', '#/public/clubs/:id'],
  },
  {
    id: 'club-operations',
    title: 'Club Application Flow',
    summary:
      '首页蓝图中的入会申请工作台，串联 joinable club 列表、当前玩家身份、申请提交与撤回流程，并保留 mock fallback。',
    entities: ['Club', 'Registered Player', 'Club Application'],
    primaryRoles: ['RegisteredPlayer', 'ClubAdmin'],
    routes: ['GET /clubs', 'GET /players/me', 'POST /clubs/:clubId/applications'],
  },
  {
    id: 'member-hub',
    title: 'Member Hub',
    summary:
      '面向已注册成员与社团管理员的读工作台，展示玩家 dashboard、社团 dashboard 与入会申请 inbox。',
    entities: ['Player Dashboard', 'Club Dashboard', 'Club Application Inbox'],
    primaryRoles: ['RegisteredPlayer', 'ClubAdmin'],
    routes: ['#/member-hub', 'GET /dashboards/players/:playerId', 'GET /clubs/:clubId/applications'],
  },
  {
    id: 'tournament-ops',
    title: 'Tournament Operations',
    summary:
      '面向赛事运营的桌位、战绩与申诉视图，目前依旧是 scaffold 风格，但已经对接 tables / records / appeals 这些高价值接口。',
    entities: ['Tournament', 'Stage', 'Table', 'Appeal Ticket'],
    primaryRoles: ['TournamentAdmin'],
    routes: ['#/tournament-ops', 'GET /tournaments/:id/stages/:stageId/tables', 'GET /appeals'],
  },
  {
    id: 'api-client',
    title: 'API Client & Normalization',
    summary:
      '共享请求层负责 URL 组装、fetch/json 处理与 payload normalization，保证页面使用的是前端统一模型而不是原始后端形状。',
    entities: ['ListEnvelope', 'PublicSchedule', 'ClubSummary', 'TournamentPublicProfile'],
    primaryRoles: ['Guest', 'RegisteredPlayer', 'ClubAdmin', 'TournamentAdmin', 'SuperAdmin'],
    routes: ['src/api/client.ts', 'doc/README.md', 'doc/FRONTEND_INTERFACE_CONTRACTS.md'],
  },
];
