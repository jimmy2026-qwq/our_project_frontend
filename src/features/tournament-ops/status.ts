import type { TableStatus } from '@/domain/common';

export function getTableStatusLabel(status: TableStatus) {
  switch (status) {
    case 'WaitingPreparation':
      return '閺堫亜绱戝?';
    case 'InProgress':
      return '鐎电懓鐪稉?';
    case 'Scoring':
      return '缂佹挾鐣绘稉?';
    case 'Archived':
      return '瀹歌尙绮ㄩ弶?';
    case 'AppealPending':
      return '閻㈠疇鐦旀稉?';
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
