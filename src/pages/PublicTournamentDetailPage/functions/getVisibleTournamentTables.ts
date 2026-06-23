import { TableStatus } from '@/objects';

import type { TournamentDetailTableItem } from '@/pages/PublicTournamentDetailPage/objects/table/TournamentDetailTableItem';
import { getTableSortWeight } from './getTournamentTableStatus';

export function getVisibleTournamentTables({
  canManageTournament,
  operatorId,
  tables,
}: {
  canManageTournament: boolean;
  operatorId?: string;
  tables: TournamentDetailTableItem[];
}) {
  return [
    ...(canManageTournament
      ? tables
      : tables.filter(
          (table) =>
            (table.status === TableStatus.WaitingPreparation &&
              !!operatorId &&
              table.playerIds.includes(operatorId)) ||
            table.status === TableStatus.InProgress ||
            table.status === TableStatus.Scoring ||
            table.status === TableStatus.AppealInProgress ||
            table.status === TableStatus.Archived,
        )),
  ].sort((left, right) => {
    const leftIsOwnWaitingTable =
      !canManageTournament &&
      !!operatorId &&
      left.status === TableStatus.WaitingPreparation &&
      left.playerIds.includes(operatorId);
    const rightIsOwnWaitingTable =
      !canManageTournament &&
      !!operatorId &&
      right.status === TableStatus.WaitingPreparation &&
      right.playerIds.includes(operatorId);

    if (leftIsOwnWaitingTable !== rightIsOwnWaitingTable) {
      return leftIsOwnWaitingTable ? -1 : 1;
    }

    const weightDelta =
      getTableSortWeight(left.status) - getTableSortWeight(right.status);

    if (weightDelta !== 0) {
      return weightDelta;
    }

    return left.tableCode.localeCompare(right.tableCode, 'zh-CN');
  });
}
