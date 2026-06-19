import { AppealStatuses, PlayerStatuses, TableStatuses } from '@/objects';
import type { AppealSummary } from '@/pages/shared_objects/tournament/AppealSummary';
import type { TournamentTableSummary } from '@/pages/shared_objects/tournament/TournamentTableSummary';

import type { PlayerDetailTab } from '../objects/PlayerDashboardContent.types';

export const playerDashboardTabs: Array<{
  id: PlayerDetailTab;
  label: string;
}> = [
  { id: 'home', label: '主页概览' },
  { id: 'recent', label: '近期牌桌' },
  { id: 'history', label: '历史牌谱' },
  { id: 'appeals', label: '我的工单' },
];

export function getRecentTableStatusLabel(
  status: TournamentTableSummary['status'],
) {
  switch (status) {
    case TableStatuses.WaitingPreparation:
      return '待准备';
    case TableStatuses.InProgress:
      return '进行中';
    case TableStatuses.Scoring:
      return '等待申诉';
    case TableStatuses.AppealInProgress:
      return '申诉处理中';
    case TableStatuses.Archived:
      return '已归档';
    default:
      return status;
  }
}

export function getAppealStatusLabel(status: AppealSummary['status']) {
  switch (status) {
    case AppealStatuses.Open:
      return '待处理';
    case AppealStatuses.UnderReview:
      return '审核中';
    case AppealStatuses.Resolved:
      return '已解决';
    case AppealStatuses.Rejected:
      return '已驳回';
    case AppealStatuses.Escalated:
      return '已升级';
    default:
      return status;
  }
}

export function getAppealStatusTone(status: AppealSummary['status']) {
  switch (status) {
    case AppealStatuses.Resolved:
      return 'success' as const;
    case AppealStatuses.Rejected:
      return 'danger' as const;
    case AppealStatuses.Escalated:
      return 'warning' as const;
    case AppealStatuses.UnderReview:
      return 'neutral' as const;
    case AppealStatuses.Open:
    default:
      return 'warning' as const;
  }
}

export function getPlayerStatusLabel(status?: string) {
  switch (status) {
    case PlayerStatuses.Active:
      return '正常';
    case PlayerStatuses.Suspended:
      return '停用';
    case PlayerStatuses.Banned:
      return '封禁';
    default:
      return status || '--';
  }
}
