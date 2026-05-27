import type { TournamentDetailWorkbenchState } from '../../../objects/tournament-detail.types';

import { useTournamentManagedTableDetail } from './TournamentManagedTableDetail.hooks';
import { useTournamentTableActionsRuntime } from './TournamentTableActionsRuntime.hooks';
import { useTournamentWaitingTableRuntime } from './TournamentWaitingTableRuntime.hooks';

export function useTournamentTableRuntime({
  operatorId,
  workbench,
  onScheduleSuccess,
}: {
  operatorId: string;
  workbench: TournamentDetailWorkbenchState | null;
  onScheduleSuccess?: () => void;
}) {
  const tableDetail = useTournamentManagedTableDetail();
  const waitingTables = useTournamentWaitingTableRuntime({
    operatorId,
    setTableDetailError: tableDetail.setTableDetailError,
    workbench,
  });
  const tableActions = useTournamentTableActionsRuntime({
    operatorId,
    onScheduleSuccess,
    playerNameMap: workbench?.playerNames ?? {},
    selectedManageTable: tableDetail.selectedManageTable,
    setSelectedManageTable: tableDetail.setSelectedManageTable,
    setTableDetail: tableDetail.setTableDetail,
    setTableDetailError: tableDetail.setTableDetailError,
  });

  return {
    ...tableDetail,
    ...waitingTables,
    ...tableActions,
  };
}
