import { TableStatuses, type TableStatus } from '@/objects';

export function getTableStatusLabel(status: TableStatus) {
  switch (status) {
    case TableStatuses.WaitingPreparation:
      return '等待准备';
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

export function getTableSortWeight(status: TableStatus) {
  switch (status) {
    case TableStatuses.InProgress:
    case TableStatuses.Scoring:
    case TableStatuses.AppealInProgress:
      return 0;
    case TableStatuses.Archived:
      return 1;
    case TableStatuses.WaitingPreparation:
      return 2;
    default:
      return 3;
  }
}

export function getTableStatusTone(status: TableStatus) {
  switch (status) {
    case TableStatuses.InProgress:
      return 'success' as const;
    case TableStatuses.Scoring:
      return 'warning' as const;
    case TableStatuses.AppealInProgress:
      return 'danger' as const;
    case TableStatuses.Archived:
      return 'neutral' as const;
    case TableStatuses.WaitingPreparation:
      return 'warning' as const;
    default:
      return 'neutral' as const;
  }
}
