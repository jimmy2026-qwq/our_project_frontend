import { DataTablePanel } from '@/components/shared/data-display';
import { TableCell, TableRow } from '@/components/ui';
import type { AppealSummary } from '@/domain/operations';

import type { LoadState } from './data';

export function AppealsPanel({ payload }: { payload: LoadState<AppealSummary> }) {
  return (
    <DataTablePanel
      title="申诉列表"
      description="当前赛事相关的申诉记录。"
      source={payload.source}
      warning={payload.warning}
      headers={['申诉编号', '牌桌', '状态', '处理结果']}
      rows={payload.envelope.items.map((appeal) => (
        <TableRow key={appeal.id}>
          <TableCell>
            <strong>{appeal.id}</strong>
          </TableCell>
          <TableCell>{appeal.tableId}</TableCell>
          <TableCell>{appeal.status}</TableCell>
          <TableCell>{appeal.verdict}</TableCell>
        </TableRow>
      ))}
      emptyText="当前筛选条件下没有申诉记录。"
    />
  );
}
