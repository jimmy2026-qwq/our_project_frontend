import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { GetPlayerAPI } from '@/api/player';
import {
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
} from '@/components/ui';
import type { MatchRecordSummary } from '@/pages/objects/TournamentViews';
import { formatPoints } from '@/pages/TablePaifuPage/functions/getReplay';
import { sendAPI } from '@/system/api';

import { formatDateTime } from '../../functions/formatDateTime';
import { detailShellClassNames } from '../../../PlayerDashboardShell.styles';

export function HistoryPaifuPanel({ items }: { items: MatchRecordSummary[] }) {
  const [summaryRecord, setSummaryRecord] = useState<MatchRecordSummary | null>(
    null,
  );
  const [playerNames, setPlayerNames] = useState<Record<string, string>>({});
  const playerIdsKey = useMemo(
    () =>
      Array.from(
        new Set(
          items.flatMap((record) =>
            (record.seatResults ?? []).map((seat) => seat.playerId),
          ),
        ),
      )
        .filter(Boolean)
        .sort()
        .join('|'),
    [items],
  );

  useEffect(() => {
    let cancelled = false;
    const playerIds = playerIdsKey ? playerIdsKey.split('|') : [];
    const missingPlayerIds = playerIds.filter(
      (playerId) => !(playerId in playerNames),
    );

    if (missingPlayerIds.length === 0) {
      return undefined;
    }

    async function loadPlayerNames() {
      const entries = await Promise.all(
        missingPlayerIds.map(async (playerId) => {
          try {
            const player = await sendAPI(new GetPlayerAPI(playerId));
            return [playerId, player.nickname || playerId] as const;
          } catch {
            return [playerId, playerId] as const;
          }
        }),
      );

      if (!cancelled) {
        setPlayerNames((current) => ({
          ...current,
          ...Object.fromEntries(entries),
        }));
      }
    }

    void loadPlayerNames();

    return () => {
      cancelled = true;
    };
  }, [playerIdsKey, playerNames]);

  return (
    <>
      <section className={detailShellClassNames.list}>
        <div className={detailShellClassNames.listBody}>
          {items.length > 0 ? (
            items.map((record) => (
              <article
                key={record.id}
                className={detailShellClassNames.listRow}
              >
                <div className={detailShellClassNames.listRowMain}>
                  <strong>
                    {record.tournamentName ?? record.tournamentId}
                  </strong>
                  <span>{record.stageName ?? record.stageId}</span>
                </div>
                <div className={detailShellClassNames.listRowSide}>
                  <span>{formatDateTime(record.recordedAt)}</span>
                  <div className={detailShellClassNames.actionRow}>
                    <button
                      type="button"
                      className={detailShellClassNames.action}
                      onClick={() => setSummaryRecord(record)}
                    >
                      查看摘要
                    </button>
                    <Link
                      className={detailShellClassNames.action}
                      to={`/tables/${record.tableId}/paifu`}
                    >
                      查看牌谱
                    </Link>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <EmptyState asListItem={false}>暂无历史牌谱。</EmptyState>
          )}
        </div>
      </section>

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
                playerNames={playerNames}
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
