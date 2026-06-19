import { TableStatuses, type TableStatus } from '@/objects';

export function getTableStatusLabel(status: TableStatus) {
  switch (status) {
    case TableStatuses.WaitingPreparation:
      return '等待开始';
    case TableStatuses.InProgress:
      return '对局中';
    case TableStatuses.Scoring:
      return '结算中';
    case TableStatuses.Archived:
      return '已结束';
    case TableStatuses.AppealInProgress:
      return '申诉处理中';
    default:
      return status;
  }
}

export function getTableStatusBadgeClassName(status: TableStatus) {
  switch (status) {
    case TableStatuses.InProgress:
      return 'border-[rgba(114,216,209,0.28)] text-[#8fe8e1]';
    case TableStatuses.WaitingPreparation:
      return 'border-[rgba(236,197,122,0.24)] text-[#ecc57a]';
    case TableStatuses.Archived:
      return 'border-[rgba(176,223,229,0.14)] text-[#c7d6e2]';
    case TableStatuses.Scoring:
      return 'border-[rgba(126,162,246,0.24)] text-[color:#b8c8ff]';
    case TableStatuses.AppealInProgress:
      return 'border-[rgba(244,126,126,0.28)] text-[color:#ffb1b1]';
    default:
      return '';
  }
}
