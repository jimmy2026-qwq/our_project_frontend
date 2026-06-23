import { DataPanel, ListRow, EmptyState, Badge, Button } from '@/components/ui';


import type { TournamentTableSummary } from '@/pages/shared_objects/tournament/TournamentTableSummary';

import type { LoadState } from '../objects/LoadState';
import { getTableStatusBadgeClassName, getTableStatusLabel } from './TablesPanel.status';

interface TablesPanelProps {
  payload: LoadState<TournamentTableSummary>;
  selectedTableId: string | null;
  onSelectTable: (tableId: string) => void;
  playerNames: Record<string, string>;
}

/** 赛事运营页中展示牌桌列表和牌桌操作入口的面板。 */
export function TablesPanel({
  payload,
  selectedTableId,
  onSelectTable,
  playerNames,
}: TablesPanelProps) {
  return (
    <DataPanel
      title="牌桌队列"
      description="当前所选赛事阶段下的牌桌列表。"
      warning={payload.warning}
    >
      <ul className="m-0 grid list-none gap-0 p-0">
        {payload.envelope.items.length > 0 ? (
          payload.envelope.items.map((table) => (
            <ListRow
              key={table.id}
              main={
                <>
                  <strong>{table.tableCode}</strong>
                  <span>
                    {table.playerIds.length > 0
                      ? table.playerIds
                          .map((playerId) => playerNames[playerId] ?? playerId)
                          .join(', ')
                      : table.id}
                  </span>
                </>
              }
              aside={
                <>
                  <Badge
                    variant="outline"
                    className={getTableStatusBadgeClassName(table.status)}
                  >
                    {getTableStatusLabel(table.status)}
                  </Badge>
                  <span>{table.seatCount} 个座位</span>
                  <Button
                    size="sm"
                    variant={
                      selectedTableId === table.id ? 'secondary' : 'outline'
                    }
                    onClick={() => onSelectTable(table.id)}
                  >
                    {selectedTableId === table.id ? '已选中' : '查看'}
                  </Button>
                </>
              }
            />
          ))
        ) : (
          <EmptyState asListItem={false}>当前筛选条件下没有牌桌。</EmptyState>
        )}
      </ul>
    </DataPanel>
  );
}
