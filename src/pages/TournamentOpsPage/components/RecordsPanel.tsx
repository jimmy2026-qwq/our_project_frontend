import { DataTablePanel, TableCell, TableRow } from '@/components/ui';

import type { MatchRecordSummary } from '@/pages/shared_objects/tournament/MatchRecordSummary';

import { formatDateTime } from '../functions/formatTournamentOpsDateTime';
import type { LoadState } from '../objects/LoadState';

/** 赛事运营页中展示对局记录和牌谱摘要的面板。 */
export function RecordsPanel({
  payload,
}: {
  payload: LoadState<MatchRecordSummary>;
}) {
  return (
    <DataTablePanel
      title="对局记录"
      description="当前赛事阶段相关的最近记录。"
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
