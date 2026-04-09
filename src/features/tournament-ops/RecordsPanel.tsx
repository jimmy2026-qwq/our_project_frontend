import { DataTablePanel } from '@/components/shared/data-display';
import { TableCell, TableRow } from '@/components/ui';
import type { MatchRecordSummary } from '@/domain/operations';

import { formatDateTime, type LoadState } from './data';

export function RecordsPanel({ payload }: { payload: LoadState<MatchRecordSummary> }) {
  return (
    <DataTablePanel
      title="Match Records"
      description="Recent records related to the active tournament stage."
      source={payload.source}
      warning={payload.warning}
      headers={['Record', 'Table', 'Recorded at', 'Summary']}
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
      emptyText="No match records were returned for the current filters."
    />
  );
}
