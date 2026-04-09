import { DataTablePanel } from '@/components/shared/data-display';
import { TableCell, TableRow } from '@/components/ui';
import type { MatchRecordSummary } from '@/domain/operations';

import { formatDateTime, type LoadState } from './data';

export function RecordsPanel({ payload }: { payload: LoadState<MatchRecordSummary> }) {
  return (
    <DataTablePanel
      title="对局记录"
      description="当前赛事阶段相关的最近记录。"
      source={payload.source}
      warning={payload.warning}
      headers={['记录编号', '牌桌', '记录时间', '摘要']}
      rows={payload.envelope.items.map((record) => (
        <TableRow key={record.id}>
          <TableCell>
            <strong>{record.id}</strong>
          </TableCell>
          <TableCell>{record.tableId}</TableCell>
          <TableCell>{formatDateTime(record.recordedAt)}</TableCell>
          <TableCell>{record.summary}</TableCell>
        </TableRow>
      ))}
      emptyText="当前筛选条件下没有返回任何对局记录。"
    />
  );
}
