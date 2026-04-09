import { Link } from 'react-router-dom';

import { authApi } from '@/api/auth';
import { operationsApi } from '@/api/operations';
import { publicApi } from '@/api/public';
import type { MatchRecordSummary, TournamentTableSummary } from '@/domain';
import {
  DetailCard,
  DetailHero,
  DetailList,
  DetailListItem,
  DetailPageShell,
  DetailRow,
  DetailRows,
  MetricCard,
  MetricGrid,
} from '@/components/shared/data-display';
import { EmptyState } from '@/components/shared/feedback';
import { Badge } from '@/components/ui';
import { PublicHallLoading } from '@/features/public-hall/components';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { useAuth } from '@/hooks/useAuth';

interface RecentTableItem extends TournamentTableSummary {
  tournamentName: string;
}

function formatClubList(clubIds: string[]) {
  if (clubIds.length === 0) {
    return '未加入俱乐部';
  }

  return clubIds.join(' / ');
}

function getRecentTableLabel(status: TournamentTableSummary['status']) {
  if (status === 'WaitingPreparation') {
    return '等待开始';
  }

  return '对局中';
}

function UpcomingMatches({ items }: { items: RecentTableItem[] }) {
  return (
    <DetailCard title="最近对局">
      {items.length > 0 ? (
        <DetailRows>
          {items.map((table) => (
            <DetailRow
              key={table.id}
              title={
                <div className="flex flex-wrap items-center gap-3">
                  <Link className="detail-link inline-flex" to={`/public/tournaments/${table.tournamentId}`}>
                    {table.tournamentName} - {table.tableCode}
                  </Link>
                  <Badge variant="outline">{getRecentTableLabel(table.status)}</Badge>
                </div>
              }
              detail={`4 人桌 / 阶段 ${table.stageId}`}
            />
          ))}
        </DetailRows>
      ) : (
        <EmptyState asListItem={false}>当前没有即将开始或进行中的对局。</EmptyState>
      )}
    </DetailCard>
  );
}

function ArchivedMatches({ items }: { items: MatchRecordSummary[] }) {
  return (
    <DetailCard title="最近已结束">
      {items.length > 0 ? (
        <DetailRows>
          {items.map((record) => (
            <DetailRow
              key={record.id}
              title={
                <div className="flex flex-wrap items-center gap-3">
                  <span>{record.summary}</span>
                  <Link className="detail-link inline-flex" to={`/tables/${record.tableId}/paifu`}>
                    查看牌谱
                  </Link>
                </div>
              }
              detail={`赛事 ${record.tournamentId} / 阶段 ${record.stageId}`}
            />
          ))}
        </DetailRows>
      ) : (
        <EmptyState asListItem={false}>当前还没有已结束的个人对局记录。</EmptyState>
      )}
    </DetailCard>
  );
}

export function PlayerDashboardPage() {
  const { session } = useAuth();
  const operatorId = session?.user.operatorId ?? '';

  const { data, isLoading } = useAsyncResource(async () => {
    if (!operatorId) {
      return null;
    }

    const [player, dashboard, tablesEnvelope, recordsEnvelope] = await Promise.all([
      authApi.getCurrentPlayer(operatorId),
      publicApi.getPlayerDashboard(operatorId, operatorId),
      operationsApi.getTables({ playerId: operatorId, limit: 8 }),
      operationsApi.getRecords({ playerId: operatorId, limit: 8 }),
    ]);

    const rawRecentTables = tablesEnvelope.items
      .filter((table) => table.status !== 'Archived')
      .sort((left, right) => {
        const rank = (status: TournamentTableSummary['status']) =>
          status === 'InProgress' ? 0 : status === 'Scoring' ? 1 : status === 'AppealPending' ? 2 : 3;
        return rank(left.status) - rank(right.status);
      });

    const tournamentNames = new Map<string, string>();
    await Promise.all(
      [...new Set(rawRecentTables.map((table) => table.tournamentId).filter(Boolean))].map(async (tournamentId) => {
        try {
          const tournament = await publicApi.getPublicTournamentProfile(tournamentId);
          tournamentNames.set(tournamentId, tournament.name);
        } catch {
          tournamentNames.set(tournamentId, tournamentId);
        }
      }),
    );

    const recentTables: RecentTableItem[] = rawRecentTables.map((table) => ({
      ...table,
      tournamentName: tournamentNames.get(table.tournamentId) ?? table.tournamentId,
    }));

    const archivedRecords = [...recordsEnvelope.items]
      .sort((left, right) => right.recordedAt.localeCompare(left.recordedAt))
      .slice(0, 6);

    return { player, dashboard, recentTables, archivedRecords };
  }, [operatorId]);

  if (isLoading) {
    return (
      <PublicHallLoading
        eyebrow="个人主页"
        title="正在加载个人看板..."
        summary="正在同步个人资料、统计面板和最近对局。"
        progressLabel="个人看板加载中"
        progressMessage="正在获取玩家资料、个人 dashboard 和最近对局记录。"
      />
    );
  }

  if (!data) {
    return (
      <DetailPageShell
        backLink={
          <Link className="detail-back" to="/public">
            返回公共大厅
          </Link>
        }
        hero={
          <DetailHero
            eyebrow="个人看板"
            title="个人信息不可用"
            summary="当前无法读取你的个人资料或 dashboard，请稍后刷新重试。"
          />
        }
      />
    );
  }

  const { player, dashboard, recentTables, archivedRecords } = data;

  return (
    <DetailPageShell
      backLink={
        <Link className="detail-back" to="/public">
          返回公共大厅
        </Link>
      }
      hero={
        <DetailHero
          eyebrow="个人看板"
          title={player.displayName}
          tagline={`ELO ${player.elo}`}
          summary="这里会展示你的基础资料、当前个人 dashboard，以及最近参与过的对局。"
        />
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,1.05fr)]">
        <DetailCard title="个人资料">
          <DetailList>
            <DetailListItem label="昵称" value={player.displayName} />
            <DetailListItem label="玩家编号" value={player.playerId} />
            <DetailListItem label="当前状态" value={player.playerStatus} />
            <DetailListItem label="所属俱乐部" value={formatClubList(player.clubIds ?? [])} />
          </DetailList>
        </DetailCard>

        <DetailCard title="个人 Dashboard">
          {dashboard.metrics.length > 0 ? (
            <>
              <p className="m-0 text-[color:var(--muted-strong)]">{dashboard.headline}</p>
              <MetricGrid>
                {dashboard.metrics.map((metric) => (
                  <MetricCard key={metric.label} label={metric.label} value={metric.value} accent={metric.accent} />
                ))}
              </MetricGrid>
            </>
          ) : (
            <EmptyState asListItem={false}>当前还没有可展示的个人 dashboard 数据。</EmptyState>
          )}
        </DetailCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <UpcomingMatches items={recentTables} />
        <ArchivedMatches items={archivedRecords} />
      </div>
    </DetailPageShell>
  );
}
