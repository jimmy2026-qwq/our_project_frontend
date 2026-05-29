export function getTableStatusLabel(status: string) {
  switch (status) {
    case 'WaitingPreparation':
      return '等待准备';
    case 'InProgress':
      return '进行中';
    case 'Scoring':
      return '待结算';
    case 'AppealInProgress':
      return '申诉处理中';
    case 'Archived':
      return '已归档';
    default:
      return status;
  }
}

export function getTableSortWeight(status: string) {
  switch (status) {
    case 'InProgress':
    case 'Scoring':
    case 'AppealInProgress':
      return 0;
    case 'Archived':
      return 1;
    case 'WaitingPreparation':
      return 2;
    default:
      return 3;
  }
}

export function getTableStatusTone(status: string) {
  switch (status) {
    case 'InProgress':
      return 'success' as const;
    case 'Scoring':
      return 'warning' as const;
    case 'AppealInProgress':
      return 'danger' as const;
    case 'Archived':
      return 'neutral' as const;
    case 'WaitingPreparation':
      return 'warning' as const;
    default:
      return 'neutral' as const;
  }
}
