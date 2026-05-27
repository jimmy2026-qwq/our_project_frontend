import type { TableDetail } from '@/pages/objects/tournament';

export function getTableStatusLabel(status: TableDetail['status']) {
  switch (status) {
    case 'WaitingPreparation':
      return '等待准备';
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

export function getSeatStatusTone(detail: {
  ready: boolean;
  disconnected: boolean;
}) {
  if (detail.disconnected) {
    return 'danger' as const;
  }

  if (detail.ready) {
    return 'success' as const;
  }

  return 'warning' as const;
}

export function getSeatStatusLabel(detail: {
  ready: boolean;
  disconnected: boolean;
}) {
  if (detail.disconnected) {
    return '已断线';
  }

  if (detail.ready) {
    return '已准备';
  }

  return '待准备';
}

export function getAppealButtonText(status: TableDetail['status']) {
  if (status === 'AppealInProgress') {
    return '申诉处理中';
  }

  return '发起赛事申诉';
}

export function matchBackLinkClassName() {
  return 'inline-flex min-h-[42px] items-center justify-center rounded-2xl border border-[rgba(176,223,229,0.14)] bg-[rgba(255,255,255,0.03)] px-4 py-2.5 text-[#f2f7fb] no-underline transition-[transform,border-color] duration-200 hover:-translate-y-px';
}
