import { Link } from 'react-router-dom';

import {
  DetailCard,
  DetailRow,
  DetailRows,
  EmptyState,
  StatusPill,
} from '@/components/ui';

import {
  getTableStatusLabel,
  getTableStatusTone,
} from '../../../functions/getTournamentTableStatus';
import type { TournamentDetailTableItem } from '../../../objects/TournamentDetail.types';

const tournamentPanelClassNames = {
  link: 'inline-flex font-semibold text-[#8fe8e1] no-underline hover:text-[#b2f4ef]',
};

export function TournamentTablesPanel({
  visibleTables,
  playerNames,
  canManageTournament,
}: {
  visibleTables: TournamentDetailTableItem[];
  playerNames: Record<string, string>;
  canManageTournament: boolean;
}) {
  return (
    <DetailCard
      title={<span className="text-[1.25rem] font-semibold">对局信息</span>}
    >
      <div className="grid gap-4">
        {visibleTables.length > 0 ? (
          <DetailRows>
            {visibleTables.map((table) => {
              const playerLabel = table.playerIds
                .map((playerId) => playerNames[playerId] ?? playerId)
                .join(' / ');
              const isFinished = table.status === 'Archived';

              return (
                <DetailRow
                  key={table.id}
                  title={`${table.tableCode} / ${table.stageName}`}
                  detail={
                    <div className="flex flex-wrap items-center gap-3">
                      <StatusPill tone={getTableStatusTone(table.status)}>
                        {getTableStatusLabel(table.status)}
                      </StatusPill>
                      <span>{playerLabel}</span>
                      <Link
                        className={tournamentPanelClassNames.link}
                        to={
                          isFinished
                            ? `/tables/${table.id}/paifu`
                            : `/tables/${table.id}`
                        }
                      >
                        {isFinished ? '查看牌谱' : '进入牌桌'}
                      </Link>
                    </div>
                  }
                />
              );
            })}
          </DetailRows>
        ) : (
          <EmptyState asListItem={false}>
            {canManageTournament
              ? '当前还没有安排好的对局，请先生成对局名单。'
              : '当前还没有可公开查看的对局。'}
          </EmptyState>
        )}
      </div>
    </DetailCard>
  );
}
