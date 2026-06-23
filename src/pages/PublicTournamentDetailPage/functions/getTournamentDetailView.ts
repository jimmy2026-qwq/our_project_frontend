import { AppealDecisionType, AppealStatus } from '@/objects';
import type { AppealSummary } from '@/pages/shared_objects/tournament/AppealSummary';
import type { TableSeatState } from '@/pages/shared_objects/tournament/TableSeatState';

export function getSeatStatusTone(seat: TableSeatState) {
  if (seat.disconnected) {
    return 'danger' as const;
  }

  if (seat.ready) {
    return 'success' as const;
  }

  return 'warning' as const;
}

export function getSeatStatusLabel(seat: TableSeatState) {
  if (seat.disconnected) {
    return '已断线';
  }

  if (seat.ready) {
    return '已准备';
  }

  return '待准备';
}

export function getAppealStatusTone(status: AppealSummary['status']) {
  switch (status) {
    case AppealStatus.Resolved:
      return 'success' as const;
    case AppealStatus.Rejected:
      return 'danger' as const;
    case AppealStatus.UnderReview:
      return 'neutral' as const;
    case AppealStatus.Escalated:
    case AppealStatus.Open:
    default:
      return 'warning' as const;
  }
}

export function getAppealStatusLabel(status: AppealSummary['status']) {
  switch (status) {
    case AppealStatus.Open:
      return '\u5f85\u5904\u7406';
    case AppealStatus.UnderReview:
      return '\u5ba1\u6838\u4e2d';
    case AppealStatus.Resolved:
      return '\u5df2\u5904\u7406';
    case AppealStatus.Rejected:
      return '\u5df2\u9a73\u56de';
    case AppealStatus.Escalated:
      return '\u5df2\u5347\u7ea7';
    default:
      return status;
  }
}

export function getAppealDecisionLabel(decision: AppealDecisionType) {
  switch (decision) {
    case AppealDecisionType.Resolve:
      return '解决';
    case AppealDecisionType.Reject:
      return '驳回';
    case AppealDecisionType.Escalate:
      return '升级';
    default:
      return decision;
  }
}

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
