import { EmptyState } from '@/components/ui';
import type { TournamentTableSummary } from '@/pages/objects/tournament';

import { getTableStatusLabel } from '../../TablesPanel.status';

interface TableActionSummaryProps {
  table: TournamentTableSummary | null;
  playerNames: Record<string, string>;
}

export function TableActionSummary({
  table,
  playerNames,
}: TableActionSummaryProps) {
  if (!table) {
    return (
      <EmptyState asListItem={false}>
        请先从左侧牌桌列表中选择一张桌子。
      </EmptyState>
    );
  }

  const playerLabel = table.playerIds.length
    ? table.playerIds
        .map((playerId) => playerNames[playerId] ?? playerId)
        .join(', ')
    : '暂无玩家信息';

  return (
    <div className="grid gap-1 text-[#c7d6e2]">
      <strong>{table.tableCode}</strong>
      <span>{table.id}</span>
      <span>
        {getTableStatusLabel(table.status)} / {table.seatCount} 个座位 /{' '}
        {playerLabel}
      </span>
    </div>
  );
}
