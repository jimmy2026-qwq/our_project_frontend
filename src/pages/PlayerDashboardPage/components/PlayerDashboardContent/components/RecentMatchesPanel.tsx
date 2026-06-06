import { Link } from 'react-router-dom';

import { EmptyState } from '@/components/ui';

import type { RecentTableItem } from '../../../objects/PlayerDashboard.types';
import { getRecentTableStatusLabel } from '../functions/getPlayerDashboardLabels';
import { detailShellClassNames } from '../../PlayerDashboardShell.styles';

export function RecentMatchesPanel({ items }: { items: RecentTableItem[] }) {
  return (
    <section className={detailShellClassNames.list}>
      <div className={detailShellClassNames.listBody}>
        {items.length > 0 ? (
          items.map((table) => {
            const hasResult =
              table.status === 'Scoring' ||
              table.status === 'AppealInProgress' ||
              table.status === 'Archived';

            return (
              <article
                key={table.id}
                className={detailShellClassNames.listRow}
              >
                <div className={detailShellClassNames.listRowMain}>
                  <strong>{`${table.tournamentName} - ${table.tableCode}`}</strong>
                  <span>{`赛事 ID：${table.tournamentId}`}</span>
                  <span>{`当前状态：${getRecentTableStatusLabel(table.status)}`}</span>
                </div>
                <div className={detailShellClassNames.listRowSide}>
                  <span>{`赛段 ID：${table.stageId}`}</span>
                  <div className={detailShellClassNames.actionRow}>
                    <Link
                      className={detailShellClassNames.action}
                      to={`/public/tournaments/${table.tournamentId}`}
                    >
                      查看赛事
                    </Link>
                    {table.status === 'WaitingPreparation' ? (
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
          <EmptyState asListItem={false}>暂无最近参赛牌桌。</EmptyState>
        )}
      </div>
    </section>
  );
}
