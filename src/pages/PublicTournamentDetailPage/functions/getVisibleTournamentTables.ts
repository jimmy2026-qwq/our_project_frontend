import type { TournamentDetailTableItem } from '../objects/TournamentDetail.types';
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
            (table.status === 'WaitingPreparation' &&
              !!operatorId &&
              table.playerIds.includes(operatorId)) ||
            table.status === 'InProgress' ||
            table.status === 'Scoring' ||
            table.status === 'AppealInProgress' ||
            table.status === 'Archived',
        )),
  ].sort((left, right) => {
    const leftIsOwnWaitingTable =
      !canManageTournament &&
      !!operatorId &&
      left.status === 'WaitingPreparation' &&
      left.playerIds.includes(operatorId);
    const rightIsOwnWaitingTable =
      !canManageTournament &&
      !!operatorId &&
      right.status === 'WaitingPreparation' &&
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
