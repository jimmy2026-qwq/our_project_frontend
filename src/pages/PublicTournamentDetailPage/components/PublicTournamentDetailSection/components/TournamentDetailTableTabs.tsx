import { Link } from 'react-router-dom';

import { Alert, Button, EmptyState, StatusPill } from '@/components/ui';
import { cx } from '@/components/ui/cx';
import type { TableDetail } from '@/pages/objects/tournament';

import { detailShellClassNames } from '../styles';
import type {
  TournamentDetailTableItem,
  TournamentDetailWorkbenchState,
} from '../../../objects/tournament-detail.types';
import {
  getTableStatusLabel,
  getTableStatusTone,
} from '../../../objects/tournament-detail.workbench';

export function TournamentDetailTablesTab({
  operatorId,
  participantWaitingTableDetails,
  tableDetailError,
  updatingReadyTableId,
  uploadingDemoPaifuTableId,
  workbench,
  onToggleOwnReady,
  onUploadDemoPaifu,
}: {
  operatorId: string;
  participantWaitingTableDetails: Record<string, TableDetail>;
  tableDetailError: string;
  updatingReadyTableId: string;
  uploadingDemoPaifuTableId: string;
  workbench: TournamentDetailWorkbenchState;
  onToggleOwnReady: (tableId: string, isReady: boolean) => void;
  onUploadDemoPaifu: (table: TournamentDetailTableItem) => void;
}) {
  return (
    <div
      className={cx(
        detailShellClassNames.panel,
        detailShellClassNames.panelFull,
      )}
    >
      <section className={detailShellClassNames.list}>
        <div className={detailShellClassNames.listBody}>
          {tableDetailError ? (
            <Alert variant="danger">{tableDetailError}</Alert>
          ) : null}
          {workbench.visibleTables.length > 0 ? (
            workbench.visibleTables.map((table) => {
              const playerLabel = table.playerIds
                .map((playerId) => workbench.playerNames[playerId] ?? playerId)
                .join(' / ');
              const isFinished = table.status === 'Archived';
              const isInProgress = table.status === 'InProgress';
              const isWaiting = table.status === 'WaitingPreparation';
              const participantTableDetail =
                participantWaitingTableDetails[table.id];
              const ownSeat =
                participantTableDetail?.seats.find(
                  (seat) => seat.playerId === operatorId,
                ) ?? null;
              const canUpdateOwnReady =
                table.status === 'WaitingPreparation' &&
                !!ownSeat &&
                !ownSeat.disconnected;

              return (
                <article key={table.id} className={detailShellClassNames.row}>
                  <div className={detailShellClassNames.rowMain}>
                    <strong>{table.tableCode}</strong>
                    <span>{table.stageName}</span>
                    <span>{playerLabel}</span>
                  </div>
                  <div className={detailShellClassNames.rowSide}>
                    <StatusPill tone={getTableStatusTone(table.status)}>
                      {getTableStatusLabel(table.status)}
                    </StatusPill>
                    <div className={detailShellClassNames.actionRow}>
                      {canUpdateOwnReady ? (
                        <button
                          type="button"
                          className={cx(
                            detailShellClassNames.action,
                            ownSeat.ready
                              ? detailShellClassNames.actionReady
                              : detailShellClassNames.actionPrepare,
                          )}
                          onClick={() =>
                            onToggleOwnReady(table.id, ownSeat.ready)
                          }
                          disabled={updatingReadyTableId === table.id}
                        >
                          {updatingReadyTableId === table.id
                            ? '处理中...'
                            : ownSeat.ready
                              ? '取消准备'
                              : '标记准备'}
                        </button>
                      ) : null}
                      {workbench.canManageTournament && isInProgress ? (
                        <button
                          type="button"
                          className={detailShellClassNames.action}
                          onClick={() => onUploadDemoPaifu(table)}
                          disabled={uploadingDemoPaifuTableId === table.id}
                        >
                          {uploadingDemoPaifuTableId === table.id
                            ? '上传中...'
                            : '默认牌谱结束'}
                        </button>
                      ) : null}
                      {isWaiting ? (
                        <span className={detailShellClassNames.actionDisabled}>
                          等待开桌
                        </span>
                      ) : (
                        <Link
                          className={detailShellClassNames.action}
                          to={
                            isFinished
                              ? `/tables/${table.id}/paifu`
                              : `/tables/${table.id}`
                          }
                        >
                          {isFinished ? '查看牌谱' : '进入牌桌'}
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <EmptyState asListItem={false}>
              当前还没有可展示的赛事牌桌。
            </EmptyState>
          )}
        </div>
      </section>
    </div>
  );
}

export function TournamentDetailManageTab({
  isSubmittingTableAction,
  waitingTables,
  workbench,
  onSelectManageTable,
  onStartManagedTable,
}: {
  isSubmittingTableAction: boolean;
  waitingTables: TournamentDetailTableItem[];
  workbench: TournamentDetailWorkbenchState;
  onSelectManageTable: (table: TournamentDetailTableItem) => void;
  onStartManagedTable: (table: TournamentDetailTableItem) => void;
}) {
  return (
    <div
      className={cx(
        detailShellClassNames.panel,
        detailShellClassNames.panelFull,
      )}
    >
      <section className={detailShellClassNames.list}>
        <div className={detailShellClassNames.listBody}>
          {waitingTables.length > 0 ? (
            waitingTables.map((table) => (
              <article key={table.id} className={detailShellClassNames.row}>
                <div className={detailShellClassNames.rowMain}>
                  <strong>{table.tableCode}</strong>
                  <span>{table.stageName}</span>
                  <span>
                    {table.playerIds
                      .map(
                        (playerId) =>
                          workbench.playerNames[playerId] ?? playerId,
                      )
                      .join(' / ')}
                  </span>
                </div>
                <div className={detailShellClassNames.rowSide}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectManageTable(table)}
                  >
                    查看详情
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onStartManagedTable(table)}
                    disabled={isSubmittingTableAction}
                  >
                    开启牌桌
                  </Button>
                </div>
              </article>
            ))
          ) : (
            <EmptyState asListItem={false}>当前没有待开启的牌桌。</EmptyState>
          )}
        </div>
      </section>
    </div>
  );
}
