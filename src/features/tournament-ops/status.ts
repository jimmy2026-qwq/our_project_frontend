import type { TableStatus } from '@/domain/common';

export function getTableStatusLabel(status: TableStatus) {
  switch (status) {
    case 'WaitingPreparation':
      return '等待开始';
    case 'InProgress':
      return '对局中';
    case 'Scoring':
      return '结算中';
    case 'Archived':
      return '已结束';
    case 'AppealPending':
      return '申诉处理中';
    default:
      return status;
  }
}

export function getTableStatusBadgeClassName(status: TableStatus) {
  switch (status) {
    case 'InProgress':
      return 'border-[rgba(114,216,209,0.28)] text-[color:var(--teal-strong)]';
    case 'WaitingPreparation':
      return 'border-[rgba(236,197,122,0.24)] text-[color:var(--gold)]';
    case 'Archived':
      return 'border-[color:var(--line)] text-[color:var(--muted-strong)]';
    case 'Scoring':
      return 'border-[rgba(126,162,246,0.24)] text-[color:#b8c8ff]';
    case 'AppealPending':
      return 'border-[rgba(244,126,126,0.28)] text-[color:#ffb1b1]';
    default:
      return '';
  }
}
