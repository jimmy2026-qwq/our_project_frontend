import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { GetPlayerAPI } from '@/api/player';
import {
  EmptyState,
} from '@/components/ui';
import { PaifuSummaryDialog } from '@/components/mahjong-result/PaifuSummaryDialog';
import type { MatchRecordSummary } from '@/pages/objects/TournamentViews';
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

      <PaifuSummaryDialog
        open={!!summaryRecord}
        playerNames={playerNames}
        record={summaryRecord}
        onOpenChange={(open) => {
          if (!open) {
            setSummaryRecord(null);
          }
        }}
      />
    </>
  );
}
