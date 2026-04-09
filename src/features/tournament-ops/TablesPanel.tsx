import { DataPanel, ListRow } from '@/components/shared/data-display';
import { EmptyState } from '@/components/shared/feedback';
import { Badge, Button } from '@/components/ui';
import type { TournamentTableSummary } from '@/domain/operations';

import type { LoadState } from './data';
import { getTableStatusBadgeClassName, getTableStatusLabel } from './status';

interface TablesPanelProps {
  payload: LoadState<TournamentTableSummary>;
  selectedTableId: string;
  onSelectTable: (tableId: string) => void;
  playerNames: Record<string, string>;
}

export function TablesPanel({
  payload,
  selectedTableId,
  onSelectTable,
  playerNames,
}: TablesPanelProps) {
  return (
    <DataPanel
      title="Table Queue"
      description="Current tables in the selected tournament stage."
      source={payload.source}
      warning={payload.warning}
    >
      <ul className="list">
        {payload.envelope.items.length > 0 ? (
          payload.envelope.items.map((table) => (
            <ListRow
              key={table.id}
              main={
                <>
                  <strong>{table.tableCode}</strong>
                  <span>
                    {table.playerIds.length > 0
                      ? table.playerIds.map((playerId) => playerNames[playerId] ?? playerId).join(', ')
                      : table.id}
                  </span>
                </>
              }
              aside={
                <>
                  <Badge variant="outline" className={getTableStatusBadgeClassName(table.status)}>
                    {getTableStatusLabel(table.status)}
                  </Badge>
                  <span>{table.seatCount} seats</span>
                  <Button
                    size="sm"
                    variant={selectedTableId === table.id ? 'secondary' : 'outline'}
                    onClick={() => onSelectTable(table.id)}
                  >
                    {selectedTableId === table.id ? 'Selected' : 'Operate'}
                  </Button>
                </>
              }
            />
          ))
        ) : (
          <EmptyState asListItem>No tables matched the current filters.</EmptyState>
        )}
      </ul>
    </DataPanel>
  );
}
