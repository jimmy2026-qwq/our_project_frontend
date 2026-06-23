import { TableStatus } from '@/objects';

export function getTableStatusLabel(status: TableStatus) {
  switch (status) {
    case TableStatus.WaitingPreparation:
      return '等待准备';
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

export function getTableSortWeight(status: TableStatus) {
  switch (status) {
    case TableStatus.InProgress:
    case TableStatus.Scoring:
    case TableStatus.AppealInProgress:
      return 0;
    case TableStatus.Archived:
      return 1;
    case TableStatus.WaitingPreparation:
      return 2;
    default:
      return 3;
  }
}

export function getTableStatusTone(status: TableStatus) {
  switch (status) {
    case TableStatus.InProgress:
      return 'success' as const;
    case TableStatus.Scoring:
      return 'warning' as const;
    case TableStatus.AppealInProgress:
      return 'danger' as const;
    case TableStatus.Archived:
      return 'neutral' as const;
    case TableStatus.WaitingPreparation:
      return 'warning' as const;
    default:
      return 'neutral' as const;
  }
}
