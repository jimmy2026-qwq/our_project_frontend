import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { opsAnalyticsApi } from '@/api/opsanalytics';
import { tournamentApi } from '@/api/tournament';
import { publicApi } from '@/api/publicquery';
import {
  DetailCard,
  DetailList,
  DetailListItem,
  MetricCard,
  MetricGrid,
} from '@/components/ui';
import { EmptyState } from '@/components/ui';
import { Button, StatusPill } from '@/components/ui';
import type {
  AppealSummary,
  MatchRecordSummary,
  TournamentTableSummary,
} from '@/objects';
import { PublicHallLoading } from '@/features/public-hall/components';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { useAuth } from '@/hooks/useAuth';
import { playerApi } from '@/api/player';

interface RecentTableItem extends TournamentTableSummary {
  tournamentName: string;
}

type PlayerDetailTab = 'home' | 'recent' | 'history' | 'appeals';

function formatClubList(clubIds: string[]) {
  if (clubIds.length === 0) {
    return '暂无所属俱乐部';
  }

  return clubIds.join(' / ');
}

function formatDateTime(value?: string | null) {
  if (!value) {
    return '--';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('zh-CN');
}

function getPlayerStatusLabel(status?: string) {
  switch (status) {
    case 'Active':
      return '正常';
    case 'Inactive':
      return '停用';
    case 'Banned':
      return '封禁';
    default:
      return status || '--';
  }
}

function getRecentTableStatusLabel(status: TournamentTableSummary['status']) {
  switch (status) {
    case 'WaitingPreparation':
      return '待准备';
    case 'InProgress':
      return '进行中';
    case 'Scoring':
      return '结算中';
    case 'AppealPending':
    case 'AppealInProgress':
      return '申诉处理中';
    case 'Archived':
      return '已归档';
    default:
      return status;
  }
}

function getAppealStatusLabel(status: AppealSummary['status']) {
  switch (status) {
    case 'Open':
      return '待处理';
    case 'UnderReview':
      return '审核中';
    case 'Resolved':
      return '已解决';
    case 'Rejected':
      return '已驳回';
    case 'Escalated':
      return '已升级';
    default:
      return status;
  }
}

function getAppealStatusTone(status: AppealSummary['status']) {
  switch (status) {
    case 'Resolved':
      return 'success' as const;
    case 'Rejected':
      return 'danger' as const;
    case 'Escalated':
      return 'warning' as const;
    case 'UnderReview':
      return 'neutral' as const;
    case 'Open':
    default:
      return 'warning' as const;
  }
}

function PlayerHomePanel({
  player,
  dashboard,
}: {
  player: Awaited<ReturnType<typeof playerApi.getCurrentPlayer>>;
  dashboard: Awaited<ReturnType<typeof opsAnalyticsApi.getPlayerDashboard>>;
}) {
  return (
    <div className="player-detail-home-grid">
      <DetailCard title="个人资料">
        <DetailList>
          <DetailListItem label="昵称" value={player.displayName} />
          <DetailListItem label="玩家 ID" value={player.playerId} />
          <DetailListItem
            label="状态"
            value={getPlayerStatusLabel(player.playerStatus)}
          />
          <DetailListItem
            label="ELO"
            value={typeof player.elo === 'number' ? String(player.elo) : '--'}
          />
          <DetailListItem
            label="所属俱乐部"
            value={formatClubList(player.clubIds ?? [])}
          />
        </DetailList>
      </DetailCard>

      <DetailCard title="个人数据看板">
        {dashboard.metrics.length > 0 ? (
          <div className="grid gap-5">
            <p className="m-0 text-[color:var(--muted-strong)]">
              {dashboard.headline}
            </p>
            <MetricGrid>
              {dashboard.metrics.map((metric) => (
                <MetricCard
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                  accent={metric.accent}
                />
              ))}
            </MetricGrid>
          </div>
        ) : (
          <EmptyState asListItem={false}>
            当前还没有可展示的个人数据。
          </EmptyState>
        )}
      </DetailCard>
    </div>
  );
}

function RecentMatchesPanel({ items }: { items: RecentTableItem[] }) {
  return (
    <section className="tournament-detail-list">
      <div className="tournament-detail-list__body tournament-detail-list__body--cards">
        {items.length > 0 ? (
          items.map((table) => (
            <article key={table.id} className="tournament-detail-list__row">
              <div className="tournament-detail-list__row-main">
                <strong>{`${table.tournamentName} - ${table.tableCode}`}</strong>
                <span>{`赛事 ID：${table.tournamentId}`}</span>
                <span>{`当前状态：${getRecentTableStatusLabel(table.status)}`}</span>
              </div>
              <div className="tournament-detail-list__row-side">
                <span>{`赛段 ID：${table.stageId}`}</span>
                <div className="tournament-detail-list__action-row">
                  <Link
                    className="detail-link tournament-detail-list__action"
                    to={`/public/tournaments/${table.tournamentId}`}
                  >
                    查看赛事
                  </Link>
                  {table.status === 'WaitingPreparation' ? (
                    <span className="tournament-detail-list__action tournament-detail-list__action--disabled">
                      等待开桌
                    </span>
                  ) : (
                    <Link
                      className="detail-link tournament-detail-list__action"
                      to={`/tables/${table.id}`}
                    >
                      进入牌桌
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))
        ) : (
          <EmptyState asListItem={false}>暂无最近参赛牌桌。</EmptyState>
        )}
      </div>
    </section>
  );
}

function HistoryPaifuPanel({ items }: { items: MatchRecordSummary[] }) {
  return (
    <section className="tournament-detail-list">
      <div className="tournament-detail-list__body tournament-detail-list__body--cards">
        {items.length > 0 ? (
          items.map((record) => (
            <article key={record.id} className="tournament-detail-list__row">
              <div className="tournament-detail-list__row-main">
                <strong>{record.summary}</strong>
                <span>{`赛事 ID：${record.tournamentId}`}</span>
                <span>{`赛段 ID：${record.stageId}`}</span>
              </div>
              <div className="tournament-detail-list__row-side">
                <span>{formatDateTime(record.recordedAt)}</span>
                <Link
                  className="detail-link tournament-detail-list__action"
                  to={`/tables/${record.tableId}/paifu`}
                >
                  查看牌谱
                </Link>
              </div>
            </article>
          ))
        ) : (
          <EmptyState asListItem={false}>暂无历史牌谱。</EmptyState>
        )}
      </div>
    </section>
  );
}

function AppealTicketsPanel({ items }: { items: AppealSummary[] }) {
  return (
    <section className="tournament-detail-list">
      <div className="tournament-detail-list__body tournament-detail-list__body--cards">
        {items.length > 0 ? (
          items.map((appeal) => (
            <article key={appeal.id} className="tournament-detail-list__row">
              <div className="tournament-detail-list__row-main">
                <strong>{appeal.id}</strong>
                <span>{`牌桌 ID：${appeal.tableId}`}</span>
                <span>{appeal.description || '未填写申诉说明。'}</span>
              </div>
              <div className="tournament-detail-list__row-side">
                <StatusPill tone={getAppealStatusTone(appeal.status)}>
                  {getAppealStatusLabel(appeal.status)}
                </StatusPill>
                <span>{`提交时间：${formatDateTime(appeal.createdAt)}`}</span>
                <span>{`最近更新：${formatDateTime(appeal.updatedAt ?? appeal.createdAt)}`}</span>
                <span>{`处理结果：${appeal.resolution || '待处理'}`}</span>
              </div>
            </article>
          ))
        ) : (
          <EmptyState asListItem={false}>
            你还没有提交过赛事申诉工单。
          </EmptyState>
        )}
      </div>
    </section>
  );
}

export function PlayerDashboardPage() {
  const navigate = useNavigate();
  const { session, logout } = useAuth();
  const operatorId = session?.user.operatorId ?? '';
  const [activeTab, setActiveTab] = useState<PlayerDetailTab>('home');

  const { data, isLoading } = useAsyncResource(async () => {
    if (!operatorId) {
      return null;
    }

    try {
      const [
        player,
        dashboard,
        tablesEnvelope,
        recordsEnvelope,
        appealsEnvelope,
      ] = await Promise.all([
        playerApi.getCurrentPlayer(operatorId),
        opsAnalyticsApi.getPlayerDashboard(operatorId, operatorId),
        tournamentApi.getTables({ playerId: operatorId, limit: 8 }),
        tournamentApi.getRecords({ playerId: operatorId, limit: 8 }),
        tournamentApi.getAppeals({
          openedBy: operatorId,
          limit: 20,
          offset: 0,
        }),
      ]);

      const rawRecentTables = tablesEnvelope.items
        .filter((table) => table.status !== 'Archived')
        .sort((left, right) => {
          const rank = (status: TournamentTableSummary['status']) =>
            status === 'InProgress'
              ? 0
              : status === 'Scoring'
                ? 1
                : status === 'AppealPending' || status === 'AppealInProgress'
                  ? 2
                  : 3;

          return rank(left.status) - rank(right.status);
        });

      const tournamentNames = new Map<string, string>();
      await Promise.all(
        [
          ...new Set(
            rawRecentTables.map((table) => table.tournamentId).filter(Boolean),
          ),
        ].map(async (tournamentId) => {
          try {
            const tournament =
              await publicApi.getPublicTournamentProfile(tournamentId);
            tournamentNames.set(tournamentId, tournament.name);
          } catch {
            tournamentNames.set(tournamentId, tournamentId);
          }
        }),
      );

      const recentTables: RecentTableItem[] = rawRecentTables.map((table) => ({
        ...table,
        tournamentName:
          tournamentNames.get(table.tournamentId) ?? table.tournamentId,
      }));

      const archivedRecords = [...recordsEnvelope.items]
        .sort((left, right) => right.recordedAt.localeCompare(left.recordedAt))
        .slice(0, 8);

      const appeals = [...appealsEnvelope.items].sort((left, right) =>
        (right.updatedAt ?? right.createdAt).localeCompare(
          left.updatedAt ?? left.createdAt,
        ),
      );

      return { player, dashboard, recentTables, archivedRecords, appeals };
    } catch {
      return null;
    }
  }, [operatorId]);

  async function handleLogout() {
    await logout();
    navigate('/public');
  }

  if (isLoading) {
    return (
      <div className="tournament-detail-page">
        <PublicHallLoading
          eyebrow="玩家主页"
          title="正在加载玩家主页..."
          summary="正在同步你的个人资料、近期牌桌、历史牌谱和赛事申诉工单。"
          progressLabel="玩家主页加载中"
          progressMessage="请稍候，我们正在整理你的个人数据。"
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="tournament-detail-page">
        <section className="tournament-detail-shell">
          <header className="tournament-detail-shell__header">
            <Link className="tournament-detail-shell__back" to="/public">
              返回大厅
            </Link>
            <div className="tournament-detail-shell__title-card">玩家主页</div>
          </header>
          <div className="tournament-detail-shell__frame">
            <div className="tournament-detail-shell__content">
              <div className="tournament-detail-shell__panel tournament-detail-shell__panel--full">
                <EmptyState asListItem={false}>
                  当前无法加载玩家主页，请稍后重试。
                </EmptyState>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const { player, dashboard, recentTables, archivedRecords, appeals } = data;
  const tabItems: Array<{ id: PlayerDetailTab; label: string }> = [
    { id: 'home', label: '主页概览' },
    { id: 'recent', label: '近期牌桌' },
    { id: 'history', label: '历史牌谱' },
    { id: 'appeals', label: '我的工单' },
  ];

  return (
    <div className="tournament-detail-page">
      <section className="tournament-detail-shell">
        <header className="tournament-detail-shell__header">
          <Link className="tournament-detail-shell__back" to="/public">
            返回大厅
          </Link>
          <div className="tournament-detail-shell__title-card">{`玩家：${player.displayName}`}</div>
          <div className="tournament-detail-shell__header-actions">
            <Button variant="secondary" onClick={() => void handleLogout()}>
              退出登录
            </Button>
          </div>
        </header>

        <div className="tournament-detail-shell__frame">
          <aside className="tournament-detail-shell__sidebar">
            {tabItems.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`tournament-detail-shell__nav-item ${
                  activeTab === tab.id
                    ? 'tournament-detail-shell__nav-item--active'
                    : ''
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </aside>

          <div className="tournament-detail-shell__content">
            {activeTab === 'home' ? (
              <div className="tournament-detail-shell__panel tournament-detail-shell__panel--full">
                <PlayerHomePanel player={player} dashboard={dashboard} />
              </div>
            ) : null}

            {activeTab === 'recent' ? (
              <div className="tournament-detail-shell__panel tournament-detail-shell__panel--full">
                <RecentMatchesPanel items={recentTables} />
              </div>
            ) : null}

            {activeTab === 'history' ? (
              <div className="tournament-detail-shell__panel tournament-detail-shell__panel--full">
                <HistoryPaifuPanel items={archivedRecords} />
              </div>
            ) : null}

            {activeTab === 'appeals' ? (
              <div className="tournament-detail-shell__panel tournament-detail-shell__panel--full">
                <AppealTicketsPanel items={appeals} />
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
