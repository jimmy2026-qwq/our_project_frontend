import type { RoleCapability } from '../domain/models';

export const roleCapabilities: RoleCapability[] = [
  {
    role: 'Guest',
    description: '以公开浏览为主，不需要运营权限，主要关注赛程、社团与公开榜单。',
    landingRoute: '#/public',
    canRead: ['公开赛程', '公开社团详情', '选手榜单'],
    canWrite: [],
  },
  {
    role: 'RegisteredPlayer',
    description: '在公开浏览之外，可以进入个人工作台，并在首页发起或撤回社团申请。',
    landingRoute: '#/member-hub',
    canRead: ['个人 dashboard', '社团公开信息', '自己的申请状态'],
    canWrite: ['提交入会申请', '撤回待处理申请'],
  },
  {
    role: 'ClubAdmin',
    description: '负责社团成员视角和申请 inbox，重点是审核加入流程与查看社团运营面板。',
    landingRoute: '#/member-hub',
    canRead: ['社团 dashboard', '申请 inbox', '成员概览'],
    canWrite: ['审批申请', '配置招募策略', '维护社团运营信息'],
  },
  {
    role: 'TournamentAdmin',
    description: '聚焦赛事执行面，处理桌位、战绩、申诉等赛事运营数据。',
    landingRoute: '#/tournament-ops',
    canRead: ['赛事 stage 列表', '桌位状态', '申诉记录'],
    canWrite: ['推进赛事流程', '处理桌位状态', '跟进申诉'],
  },
  {
    role: 'SuperAdmin',
    description: '更多偏平台治理与字典审计，不是当前蓝图首页的核心互动角色，但属于系统边界的一部分。',
    landingRoute: '/admin/overview',
    canRead: ['字典配置', '审计轨迹', '全局运营视图'],
    canWrite: ['维护字典', '查看审计', '做平台级配置'],
  },
];
