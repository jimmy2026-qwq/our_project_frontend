import { Button, EmptyState } from '@/components/ui';
import { cx } from '@/components/ui/cx';

import { detailShellClassNames } from '../../../detailShell.styles';
import type {
  TournamentDetailTableItem,
  TournamentDetailWorkbenchState,
} from '../../../../objects/TournamentDetail.types';

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
