import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui';

import { TableActionAlerts } from './components/TableActionAlerts';
import type { TableActionPanelProps } from './TableActionPanel.types';
import { TableActionSummary } from './components/TableActionSummary';
import { TableNavigationActions } from './components/TableNavigationActions';
import { TableWaitingControls } from './components/TableWaitingControls';
import { useTableActionPanel } from './hooks/useTableActionPanel';

export function TableActionPanel({
  table,
  operatorId,
  canManageActions,
  reloadKey,
  onRefresh,
  playerNames,
}: TableActionPanelProps) {
  const action = useTableActionPanel({
    table,
    operatorId,
    reloadKey,
    onRefresh,
  });
  const canOperate = Boolean(table && operatorId && canManageActions);
  const selectedSeat =
    action.tableDetail?.seats.find((seat) => seat.seat === action.seatWind) ??
    null;
  const isWaitingTable = table?.status === 'WaitingPreparation';
  const isArchivedTable = table?.status === 'Archived';
  const isStartedTable = Boolean(table && !isWaitingTable && !isArchivedTable);

  return (
    <Card>
      <CardHeader>
        <CardTitle>牌桌操作</CardTitle>
        <CardDescription>
          {isWaitingTable
            ? '可以在这里开桌、重置牌桌、发起申诉，或更新座位准备状态。'
            : isArchivedTable
              ? '这张牌桌已经结束，可以打开牌谱查看本桌结果。'
              : '这张牌桌已经开始或进入赛后流程，请前往牌桌页面继续查看。'}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <TableActionSummary table={table} playerNames={playerNames} />
        <TableActionAlerts
          operatorId={operatorId}
          canManageActions={canManageActions}
          error={action.actionError}
        />

        {isWaitingTable ? (
          <TableWaitingControls
            canOperate={canOperate}
            isSubmitting={action.isSubmittingAction}
            selectedSeat={selectedSeat}
            resetNote={action.resetNote}
            appealDescription={action.appealDescription}
            seatWind={action.seatWind}
            seatReady={action.seatReady}
            seatDisconnected={action.seatDisconnected}
            seatNote={action.seatNote}
            onResetNoteChange={action.onResetNoteChange}
            onAppealDescriptionChange={action.onAppealDescriptionChange}
            onSeatWindChange={action.onSeatWindChange}
            onSeatReadyChange={action.onSeatReadyChange}
            onSeatDisconnectedChange={action.onSeatDisconnectedChange}
            onSeatNoteChange={action.onSeatNoteChange}
            onStartTable={action.onStartTable}
            onResetTable={action.onResetTable}
            onFileAppeal={action.onFileAppeal}
            onUpdateSeatState={action.onUpdateSeatState}
          />
        ) : null}

        <TableNavigationActions
          table={table}
          canManageActions={canManageActions}
          isStartedTable={isStartedTable}
          isArchivedTable={isArchivedTable}
          onOpenTablePage={action.onOpenTablePage}
          onOpenPaifuPage={action.onOpenPaifuPage}
        />
      </CardContent>
    </Card>
  );
}
