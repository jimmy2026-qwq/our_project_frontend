import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui';

import { TableActionAlerts } from './TableActionAlerts';
import type { TableActionPanelProps } from './TableActionPanel.types';
import { TableActionSummary } from './TableActionSummary';
import { TableNavigationActions } from './TableNavigationActions';
import { TableWaitingControls } from './TableWaitingControls';

export function TableActionPanel({
  table,
  tableDetail,
  operatorId,
  canManageActions,
  isSubmitting,
  error,
  resetNote,
  appealDescription,
  seatWind,
  seatReady,
  seatDisconnected,
  seatNote,
  onResetNoteChange,
  onAppealDescriptionChange,
  onSeatWindChange,
  onSeatReadyChange,
  onSeatDisconnectedChange,
  onSeatNoteChange,
  onStartTable,
  onResetTable,
  onFileAppeal,
  onUpdateSeatState,
  onOpenTablePage,
  onOpenPaifuPage,
  playerNames,
}: TableActionPanelProps) {
  const canOperate = Boolean(table && operatorId && canManageActions);
  const selectedSeat =
    tableDetail?.seats.find((seat) => seat.seat === seatWind) ?? null;
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
          error={error}
        />

        {isWaitingTable ? (
          <TableWaitingControls
            canOperate={canOperate}
            isSubmitting={isSubmitting}
            selectedSeat={selectedSeat}
            resetNote={resetNote}
            appealDescription={appealDescription}
            seatWind={seatWind}
            seatReady={seatReady}
            seatDisconnected={seatDisconnected}
            seatNote={seatNote}
            onResetNoteChange={onResetNoteChange}
            onAppealDescriptionChange={onAppealDescriptionChange}
            onSeatWindChange={onSeatWindChange}
            onSeatReadyChange={onSeatReadyChange}
            onSeatDisconnectedChange={onSeatDisconnectedChange}
            onSeatNoteChange={onSeatNoteChange}
            onStartTable={onStartTable}
            onResetTable={onResetTable}
            onFileAppeal={onFileAppeal}
            onUpdateSeatState={onUpdateSeatState}
          />
        ) : null}

        <TableNavigationActions
          table={table}
          canManageActions={canManageActions}
          isStartedTable={isStartedTable}
          isArchivedTable={isArchivedTable}
          onOpenTablePage={onOpenTablePage}
          onOpenPaifuPage={onOpenPaifuPage}
        />
      </CardContent>
    </Card>
  );
}
