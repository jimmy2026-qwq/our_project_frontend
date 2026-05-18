import { DataTablePanel } from '@/components/ui';
import { TableCell, TableRow } from '@/components/ui';
import type { AppealSummary } from '@/objects/tournament';

import type { LoadState } from './data';

function getAppealStatusLabel(status: AppealSummary['status']) {
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

export function AppealsPanel({
  payload,
}: {
  payload: LoadState<AppealSummary>;
}) {
  return (
    <DataTablePanel
      title="赛事申诉"
      description="查看当前赛事相关的申诉工单，以及它们的处理状态和处理结果。"
      source={payload.source}
      warning={payload.warning}
      headers={['工单 ID', '牌桌', '状态', '处理结果']}
      rows={payload.envelope.items.map((appeal) => (
        <TableRow key={appeal.id}>
          <TableCell>
            <strong>{appeal.id}</strong>
          </TableCell>
          <TableCell>{appeal.tableId}</TableCell>
          <TableCell>{getAppealStatusLabel(appeal.status)}</TableCell>
          <TableCell>{appeal.resolution || '待处理'}</TableCell>
        </TableRow>
      ))}
      emptyText="当前还没有赛事申诉工单。"
    />
  );
}
