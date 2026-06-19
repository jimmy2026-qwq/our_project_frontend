import { Link } from 'react-router-dom';

import { StatusPill } from '@/components/ui';
import { cx } from '@/components/ui/cx';
import { TableStatuses } from '@/objects';
import type { MatchRecordSummary } from '@/pages/shared_objects/tournament/MatchRecordSummary';
import type { TableDetail } from '@/pages/shared_objects/tournament/TableDetail';

import { detailShellClassNames } from '../../../detailShell.styles';
import {
  getTableStatusLabel,
  getTableStatusTone,
} from '../../../../functions/getTournamentTableStatus';
import type {
  TournamentDetailTableItem,
  TournamentDetailWorkbenchState,
} from '../../../../objects/TournamentDetail.types';

export function TournamentDetailTableRow({
  finalizingArchiveTableId,
  operatorId,
  participantWaitingTableDetails,
  table,
  updatingReadyTableId,
  uploadingDemoPaifuTableId,
  workbench,
  onFinalizeArchive,
  onOpenRecordSummary,
  onOpenTableAppeal,
  onToggleOwnReady,
  onUploadDemoPaifu,
}: {
  finalizingArchiveTableId: string | null;
  operatorId: string;
  participantWaitingTableDetails: Record<string, TableDetail>;
  table: TournamentDetailTableItem;
  updatingReadyTableId: string | null;
  uploadingDemoPaifuTableId: string | null;
  workbench: TournamentDetailWorkbenchState;
  onFinalizeArchive: (table: TournamentDetailTableItem) => void;
  onOpenRecordSummary: (record: MatchRecordSummary) => void;
  onOpenTableAppeal: (table: TournamentDetailTableItem) => void;
  onToggleOwnReady: (tableId: string, isReady: boolean) => void;
  onUploadDemoPaifu: (table: TournamentDetailTableItem) => void;
}) {
  const playerLabel = table.playerIds
    .map((playerId) => workbench.playerNames[playerId] ?? playerId)
    .join(' / ');
  const record = workbench.recordByTableId[table.id] ?? null;
  const isFinished = table.status === TableStatuses.Archived;
  const isInProgress = table.status === TableStatuses.InProgress;
  const isScoring = table.status === TableStatuses.Scoring;
  const hasResult =
    isFinished || isScoring || table.status === TableStatuses.AppealInProgress;
  const isWaiting = table.status === TableStatuses.WaitingPreparation;
  const canFileAppeal = isScoring && table.playerIds.includes(operatorId);
  const participantTableDetail = participantWaitingTableDetails[table.id];
  const ownSeat =
    participantTableDetail?.seats.find((seat) => seat.playerId === operatorId) ??
    null;
  const canUpdateOwnReady =
    table.status === TableStatuses.WaitingPreparation &&
    !!ownSeat &&
    !ownSeat.disconnected;

  return (
    <article className={detailShellClassNames.row}>
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
              onClick={() => onToggleOwnReady(table.id, ownSeat.ready)}
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
              {finalizingArchiveTableId === table.id ? '归档中...' : '确认归档'}
            </button>
          ) : null}
          {record ? (
            <button
              type="button"
              className={detailShellClassNames.action}
              onClick={() => onOpenRecordSummary(record)}
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
              to={hasResult ? `/tables/${table.id}/paifu` : `/tables/${table.id}`}
            >
              {hasResult ? '查看牌谱' : '进入牌桌'}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
