import type { FeatureModule } from '../domain/models';

export const featureModules: FeatureModule[] = [
  {
    id: 'public-hall',
    title: 'Public Hall',
    summary: '面向游客的公开视图，提供赛事排期、俱乐部名录和玩家排行榜。',
    entities: ['Tournament', 'Stage', 'Club', 'Registered Player'],
    primaryRoles: ['Guest', 'RegisteredPlayer'],
    routes: ['/public/schedules', '/public/clubs', '/public/leaderboards/players'],
  },
  {
    id: 'club-operations',
    title: 'Club Operations',
    summary: '处理入部审批、头衔管理、出战席位提报和俱乐部战力总览。',
    entities: ['Club', 'Registered Player', 'Seat', 'Advanced Stats Board'],
    primaryRoles: ['ClubAdmin', 'RegisteredPlayer'],
    routes: ['/clubs', '/clubs/:clubId/applications', '/clubs/:clubId/lineups'],
  },
  {
    id: 'tournament-ops',
    title: 'Tournament Operations',
    summary: '聚焦赛段配置、对局桌调度、申诉处置与强制状态恢复。',
    entities: ['Tournament', 'Stage', 'Table', 'Appeal Ticket'],
    primaryRoles: ['TournamentAdmin'],
    routes: ['/tournaments', '/tournaments/:id/stages', '/appeals'],
  },
  {
    id: 'recording-and-stats',
    title: 'Recording & Stats',
    summary: '处理牌谱上传、对局记录沉淀和高阶指标看板读取。',
    entities: ['Match Record', 'Paifu', 'Advanced Stats Board'],
    primaryRoles: ['RegisteredPlayer', 'TournamentAdmin', 'SuperAdmin'],
    routes: ['/records', '/tables/:tableId/paifu', '/dashboards/players/:playerId'],
  },
  {
    id: 'governance',
    title: 'Governance',
    summary: '维护系统字典、审计流和最高权限操作入口。',
    entities: ['Dictionary', 'Audit Trail', 'Registered Player', 'Club'],
    primaryRoles: ['SuperAdmin'],
    routes: ['/dictionary', '/audits', '/admin/operators'],
  },
];

