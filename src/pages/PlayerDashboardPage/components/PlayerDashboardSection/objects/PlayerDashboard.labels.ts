import type {
  AppealSummary,
  TournamentTableSummary,
} from '@/pages/objects/tournament';

export function formatDateTime(value?: string | null) {
  if (!value) {
    return '--';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('zh-CN');
}

export function getRecentTableStatusLabel(
  status: TournamentTableSummary['status'],
) {
  switch (status) {
    case 'WaitingPreparation':
      return '待准备';
    case 'InProgress':
      return '进行中';
    case 'Scoring':
      return '结算中';
    case 'AppealInProgress':
      return '申诉处理中';
    case 'Archived':
      return '已归档';
    default:
      return status;
  }
}

export function getAppealStatusLabel(status: AppealSummary['status']) {
  switch (status) {
    case 'Open':
      return '待处理';
    case 'UnderReview':
      return '审核中';
    case 'Resolved':
      return '已解决';
    case 'Rejected':
      return '已驳回';
    case 'Escalated':
      return '已升级';
    default:
      return status;
  }
}

export function getAppealStatusTone(status: AppealSummary['status']) {
  switch (status) {
    case 'Resolved':
      return 'success' as const;
    case 'Rejected':
      return 'danger' as const;
    case 'Escalated':
      return 'warning' as const;
    case 'UnderReview':
      return 'neutral' as const;
    case 'Open':
    default:
      return 'warning' as const;
  }
}

export type PlayerDetailTab = 'home' | 'recent' | 'history' | 'appeals';

export const playerDashboardTabs: Array<{
  id: PlayerDetailTab;
  label: string;
}> = [
  { id: 'home', label: '主页概览' },
  { id: 'recent', label: '近期牌桌' },
  { id: 'history', label: '历史牌谱' },
  { id: 'appeals', label: '我的工单' },
];
