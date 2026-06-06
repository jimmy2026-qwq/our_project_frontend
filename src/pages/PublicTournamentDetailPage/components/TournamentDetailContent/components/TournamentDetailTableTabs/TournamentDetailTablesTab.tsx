import { Link } from 'react-router-dom';

import { Alert, EmptyState, StatusPill } from '@/components/ui';
import { cx } from '@/components/ui/cx';
import type { TableDetail } from '@/pages/objects/TournamentViews';

import { detailShellClassNames } from '../../../detailShell.styles';
import {
  getTableStatusLabel,
  getTableStatusTone,
} from '../../../../functions/getTournamentTableStatus';
import type {
  TournamentDetailTableItem,
  TournamentDetailWorkbenchState,
} from '../../../../objects/TournamentDetail.types';

export function TournamentDetailTablesTab({
  operatorId,
  participantWaitingTableDetails,
  tableDetailError,
  updatingReadyTableId,
  uploadingDemoPaifuTableId,
  finalizingArchiveTableId,
  workbench,
  onToggleOwnReady,
  onUploadDemoPaifu,
  onOpenTableAppeal,
  onFinalizeArchive,
}: {
  operatorId: string;
  participantWaitingTableDetails: Record<string, TableDetail>;
  tableDetailError: string;
  updatingReadyTableId: string;
  uploadingDemoPaifuTableId: string;
  finalizingArchiveTableId: string;
  workbench: TournamentDetailWorkbenchState;
  onToggleOwnReady: (tableId: string, isReady: boolean) => void;
  onUploadDemoPaifu: (table: TournamentDetailTableItem) => void;
  onOpenTableAppeal: (table: TournamentDetailTableItem) => void;
  onFinalizeArchive: (table: TournamentDetailTableItem) => void;
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
              const isScoring = table.status === 'Scoring';
              const hasResult =
                isFinished || isScoring || table.status === 'AppealInProgress';
              const isWaiting = table.status === 'WaitingPreparation';
              const canFileAppeal =
                isScoring && table.playerIds.includes(operatorId);
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
                      {canFileAppeal ? (
                        <button
                          type="button"
                          className={detailShellClassNames.action}
                          onClick={() => onOpenTableAppeal(table)}
                        >
                          我要申诉
                        </button>
                      ) : null}
                      {workbench.canManageTournament && isScoring ? (
                        <button
                          type="button"
                          className={detailShellClassNames.action}
                          onClick={() => onFinalizeArchive(table)}
                          disabled={finalizingArchiveTableId === table.id}
                        >
                          {finalizingArchiveTableId === table.id
                            ? '归档中...'
                            : '确认归档'}
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
                            hasResult
                              ? `/tables/${table.id}/paifu`
                              : `/tables/${table.id}`
                          }
                        >
                          {hasResult ? '查看牌谱' : '进入牌桌'}
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
