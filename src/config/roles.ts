import type { RoleCapability } from '../domain/models';

export const roleCapabilities: RoleCapability[] = [
  {
    role: 'Guest',
    description: '未授权访客，仅有公开数据读取权限。',
    landingRoute: '/public/schedules',
    canRead: ['公开赛事排期', '俱乐部名录', '公共排行榜'],
    canWrite: [],
  },
  {
    role: 'RegisteredPlayer',
    description: '基础授权用户，可查看个人面板并参与俱乐部绑定。',
    landingRoute: '/dashboard/me',
    canRead: ['个人数据面板', '赛事记录', '公开榜单'],
    canWrite: ['发起入部申请', '上传个人相关材料', '提交申诉工单'],
  },
  {
    role: 'ClubAdmin',
    description: '俱乐部维度的运营角色，负责组织层面的成员和出战管理。',
    landingRoute: '/clubs/my-clubs',
    canRead: ['俱乐部成员列表', '席位安排', '内部统计'],
    canWrite: ['审批入部', '设置头衔', '提交席位名单'],
  },
  {
    role: 'TournamentAdmin',
    description: '赛事生命周期控制者，负责赛段、桌况和申诉处理。',
    landingRoute: '/tournaments/manage',
    canRead: ['赛事全量配置', '对局桌状态', '申诉流转'],
    canWrite: ['创建赛段', '配置规则', '裁决申诉', '强制重置桌状态'],
  },
  {
    role: 'SuperAdmin',
    description: '全局治理者，维护规则字典和权限分配。',
    landingRoute: '/admin/overview',
    canRead: ['全局审计', '系统字典', '全平台统计'],
    canWrite: ['更新数据字典', '封禁玩家', '解散俱乐部', '分配赛事管理员'],
  },
];

