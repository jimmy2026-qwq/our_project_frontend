import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Alert,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogSurface,
  DialogTitle,
  EmptyState,
  StatusPill,
} from '@/components/ui';
import { cx } from '@/components/ui/cx';
import type {
  MatchRecordSummary,
  TableDetail,
} from '@/pages/objects/TournamentViews';
import { formatPoints } from '@/pages/TablePaifuPage/functions/getReplay';

import { detailShellClassNames } from '../../../detailShell.styles';
import {
  getTableStatusLabel,
  getTableStatusTone,
} from '../../../../functions/getTournamentTableStatus';
import { formatDateTime } from '../../../../functions/getTournamentDetailView';
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
  const [summaryRecord, setSummaryRecord] =
    useState<MatchRecordSummary | null>(null);

  return (
    <>
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
              const record = workbench.recordByTableId[table.id] ?? null;
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
                      {record ? (
                        <button
                          type="button"
                          className={detailShellClassNames.action}
                          onClick={() => setSummaryRecord(record)}
                        >
                          查看摘要
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
      <Dialog
        open={!!summaryRecord}
        onOpenChange={(open) => {
          if (!open) {
            setSummaryRecord(null);
          }
        }}
      >
        <DialogPortal>
          <DialogOverlay />
          <DialogSurface className="text-[#f2f7fb]">
            <DialogHeader className="border-b border-[rgba(176,223,229,0.14)] px-6 py-5">
              <DialogTitle className="text-[#f2f7fb]">牌谱摘要</DialogTitle>
            </DialogHeader>
            <DialogBody className="grid gap-3 px-6 py-5 text-[#f2f7fb]">
              <p className="m-0 text-sm text-[#9ab0c1]">
                {summaryRecord
                  ? `记录 ${summaryRecord.id} / ${formatDateTime(summaryRecord.recordedAt)}`
                  : ''}
              </p>
              <PaifuSummaryRows
                playerNames={workbench.playerNames}
                record={summaryRecord}
              />
            </DialogBody>
            <DialogFooter className="border-t border-[rgba(176,223,229,0.14)] px-6 py-5">
              <Button onClick={() => setSummaryRecord(null)}>关闭</Button>
            </DialogFooter>
          </DialogSurface>
        </DialogPortal>
      </Dialog>
    </>
  );
}

function PaifuSummaryRows({
  playerNames,
  record,
}: {
  playerNames: Record<string, string>;
  record: MatchRecordSummary | null;
}) {
  const rows = record?.seatResults ?? [];

  if (rows.length === 0) {
    return (
      <p className="m-0 whitespace-pre-wrap leading-7 text-[#f2f7fb]">
        {record?.summary || '暂无摘要'}
      </p>
    );
  }

  return (
    <div className="grid gap-2">
      {rows.map((seat) => (
        <div
          key={`${record?.id ?? 'record'}-${seat.playerId}`}
          className="grid grid-cols-[auto_minmax(0,1fr)_7.5rem_5.75rem] items-center gap-2 border-b border-[rgba(255,255,255,0.14)] py-3 text-base leading-6"
        >
          <strong
            className={`rounded-lg border px-2 py-1 ${getPlacementClassName(
              seat.placement,
            )}`}
          >
            {seat.placement}位
          </strong>
          <span className="min-w-0 truncate text-[#c7d6e2]">
            {playerNames[seat.playerId] ?? seat.playerId}
          </span>
          <strong className="whitespace-nowrap text-right text-[#f2f7fb]">
            {formatOptionalPoints(seat.finalPoints)}点
          </strong>
          <span
            className={`whitespace-nowrap text-right font-bold ${getScoreDeltaClassName(
              seat.scoreDelta,
            )}`}
          >
            {formatScoreDelta(seat.scoreDelta)}
          </span>
        </div>
      ))}
    </div>
  );
}

function formatOptionalPoints(value?: number) {
  return typeof value === 'number' ? formatPoints(value) : '-';
}

function formatScoreDelta(value?: number) {
  if (typeof value !== 'number') {
    return '(--)';
  }

  if (value > 0) {
    return `(+${formatPoints(value)})`;
  }

  if (value < 0) {
    return `(-${formatPoints(Math.abs(value))})`;
  }

  return '(0)';
}

function getScoreDeltaClassName(value?: number) {
  if (typeof value !== 'number' || value === 0) {
    return 'text-[#ffd98a]';
  }

  return value > 0 ? 'text-[#57e38d]' : 'text-[#ff6d6d]';
}

function getPlacementClassName(placement: number) {
  const classNames: Record<number, string> = {
    1: 'border-[rgba(255,215,0,0.42)] bg-[rgba(255,215,0,0.16)] text-[#ffd700]',
    2: 'border-[rgba(192,192,192,0.42)] bg-[rgba(192,192,192,0.14)] text-[#c0c0c0]',
    3: 'border-[rgba(205,127,50,0.44)] bg-[rgba(205,127,50,0.15)] text-[#cd7f32]',
    4: 'border-[rgba(87,227,141,0.40)] bg-[rgba(87,227,141,0.13)] text-[#57e38d]',
  };

  return `whitespace-nowrap font-bold ${
    classNames[placement] ??
    'border-[rgba(242,247,251,0.24)] bg-[rgba(242,247,251,0.08)] text-[#f2f7fb]'
  }`;
}
