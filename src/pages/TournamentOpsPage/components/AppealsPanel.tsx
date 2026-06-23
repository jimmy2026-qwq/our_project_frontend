import { DataTablePanel, TableCell, TableRow } from '@/components/ui';

import { AppealStatus } from '@/objects';
import type { AppealSummary } from '@/pages/shared_objects/tournament/AppealSummary';

import type { LoadState } from '../objects/LoadState';

function getAppealStatusLabel(status: AppealSummary['status']) {
  switch (status) {
    case AppealStatus.Open:
      return '待处理';
    case AppealStatus.UnderReview:
      return '审核中';
    case AppealStatus.Resolved:
      return '已解决';
    case AppealStatus.Rejected:
      return '已驳回';
    case AppealStatus.Escalated:
      return '已升级';
    default:
      return status;
  }
}

/** 赛事运营页中查看和处理申诉工单的面板。 */
export function AppealsPanel({
  payload,
}: {
  payload: LoadState<AppealSummary>;
}) {
  return (
    <DataTablePanel
      title="赛事申诉"
      description="查看当前赛事相关的申诉工单，以及它们的处理状态和处理结果。"
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
