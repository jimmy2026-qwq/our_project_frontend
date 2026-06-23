import { AppealStatus, PlayerStatus, TableStatus } from '@/objects';
import type { AppealSummary } from '@/pages/shared_objects/tournament/AppealSummary';
import type { TournamentTableSummary } from '@/pages/shared_objects/tournament/TournamentTableSummary';

import { PlayerDetailTab } from '@/pages/PlayerDashboardPage/components/PlayerDashboardContent/objects/PlayerDetailTab';

export const playerDashboardTabs: Array<{
  id: PlayerDetailTab;
  label: string;
}> = [
  { id: PlayerDetailTab.Home, label: '主页概览' },
  { id: PlayerDetailTab.Recent, label: '近期牌桌' },
  { id: PlayerDetailTab.History, label: '历史牌谱' },
  { id: PlayerDetailTab.Appeals, label: '我的工单' },
];

export function getRecentTableStatusLabel(
  status: TournamentTableSummary['status'],
) {
  switch (status) {
    case TableStatus.WaitingPreparation:
      return '待准备';
    case TableStatus.InProgress:
      return '进行中';
    case TableStatus.Scoring:
      return '等待申诉';
    case TableStatus.AppealInProgress:
      return '申诉处理中';
    case TableStatus.Archived:
      return '已归档';
    default:
      return status;
  }
}

export function getAppealStatusLabel(status: AppealSummary['status']) {
  switch (status) {
    case AppealStatus.Open:
      return '待处理';
    case AppealStatus.UnderReview:
      return '审核中';
    case AppealStatus.Resolved:
      return '已解决';
    case AppealStatus.Rejected:
      return '已驳回';
    case AppealStatus.Escalated:
      return '已升级';
    default:
      return status;
  }
}

export function getAppealStatusTone(status: AppealSummary['status']) {
  switch (status) {
    case AppealStatus.Resolved:
      return 'success' as const;
    case AppealStatus.Rejected:
      return 'danger' as const;
    case AppealStatus.Escalated:
      return 'warning' as const;
    case AppealStatus.UnderReview:
      return 'neutral' as const;
    case AppealStatus.Open:
    default:
      return 'warning' as const;
  }
}

export function getPlayerStatusLabel(status?: string) {
  switch (status) {
    case PlayerStatus.Active:
      return '正常';
    case PlayerStatus.Suspended:
      return '停用';
    case PlayerStatus.Banned:
      return '封禁';
    default:
      return status || '--';
  }
}
