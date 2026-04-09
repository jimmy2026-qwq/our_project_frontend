import { DataTablePanel } from '@/components/shared/data-display';
import { TableCell, TableRow } from '@/components/ui';
import type { AppealSummary } from '@/domain/operations';

import type { LoadState } from './data';

export function AppealsPanel({ payload }: { payload: LoadState<AppealSummary> }) {
  return (
    <DataTablePanel
      title="Appeals"
      description="Open and historical appeals for the selected tournament."
      source={payload.source}
      warning={payload.warning}
      headers={['Appeal', 'Table', 'Status', 'Verdict']}
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
      emptyText="No appeals were returned for the current filters."
    />
  );
}
