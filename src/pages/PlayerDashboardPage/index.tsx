import type { ReactNode } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  Button,
  DescriptionItem,
  DescriptionList,
  EmptyState,
  LoadingProgress,
  MetricCard,
  MetricGrid,
  StatusPill,
} from '@/components/ui';
import { cx } from '@/components/ui/cx';
import { useAuth } from '@/app/auth/useAuth';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import type {
  AppealSummary,
  MatchRecordSummary,
  TournamentTableSummary,
} from '@/pages/objects/tournament';
import {
  loadPlayerDashboardData,
  type PlayerDashboardData,
  type RecentTableItem,
} from './objects/data';

type PlayerDetailTab = 'home' | 'recent' | 'history' | 'appeals';

const detailShellClassNames = {
  page:
    "relative isolate before:pointer-events-none before:fixed before:inset-0 before:-z-20 before:bg-[url('/tournament_background.png')] before:bg-cover before:bg-center before:bg-no-repeat after:pointer-events-none after:fixed after:inset-0 after:-z-10 after:bg-[linear-gradient(180deg,rgba(8,10,18,0.14),rgba(8,10,18,0.04)_18%,rgba(8,10,18,0.18))]",
  shell: 'relative grid gap-[18px] text-[#f2f7fb]',
  header:
    'relative grid min-h-[52px] grid-cols-[132px_minmax(0,1fr)] items-center gap-[14px] max-[980px]:min-h-0 max-[980px]:grid-cols-1',
  back:
    'fixed left-7 top-6 z-[5] inline-flex min-h-12 items-center justify-center border-2 !border-[rgba(219,175,98,0.4)] bg-[rgba(28,40,74,0.88)] bg-[linear-gradient(180deg,rgba(29,42,78,0.9),rgba(28,40,74,0.88))] px-[18px] text-[rgba(239,189,111,0.96)] no-underline shadow-none max-[980px]:static',
  title:
    'col-start-2 inline-flex min-h-[52px] min-w-[min(100%,640px)] items-center justify-center justify-self-center border-2 !border-[rgba(219,175,98,0.4)] bg-[rgba(28,40,74,0.58)] bg-[linear-gradient(180deg,rgba(29,42,78,0.74),rgba(28,40,74,0.64))] px-9 text-center text-[1.42rem] font-bold text-[rgba(239,189,111,0.98)] shadow-none max-[980px]:col-auto',
  headerActions:
    'absolute right-0 top-1/2 flex -translate-y-1/2 flex-wrap justify-end gap-2.5 max-[980px]:static max-[980px]:translate-y-0',
  frame:
    'grid grid-cols-[132px_minmax(0,1fr)] items-start max-[980px]:grid-cols-1 max-[980px]:gap-[18px]',
  sidebar:
    'relative z-[2] -ml-[72px] grid content-start gap-[14px] overflow-y-auto pt-[22px] max-[980px]:ml-0 max-[980px]:pt-0',
  navItem:
    'relative z-[1] min-h-[72px] cursor-pointer border-2 !border-[rgba(219,175,98,0.4)] bg-[rgba(28,40,74,0.88)] bg-[linear-gradient(180deg,rgba(29,42,78,0.9),rgba(28,40,74,0.88))] px-[18px] py-[14px] text-center !text-[1.18rem] !font-bold tracking-[0.04em] text-[rgba(225,230,243,0.92)] max-[980px]:border-r-2',
  navItemActive: '!border-[rgba(239,189,111,0.5)] text-[rgba(239,189,111,0.96)]',
  content:
    'relative z-[1] box-border grid h-[calc(100vh-190px)] max-h-[calc(100vh-190px)] min-h-[calc(100vh-190px)] grid-rows-[minmax(0,1fr)] overflow-hidden rounded-3xl border-2 !border-[rgba(219,175,98,0.4)] bg-[rgba(9,18,31,0.48)] bg-[linear-gradient(180deg,rgba(13,24,40,0.72),rgba(11,20,34,0.64))] px-[22px] py-[18px] shadow-[0_18px_42px_rgba(5,10,18,0.14),inset_0_1px_0_rgba(255,255,255,0.05)] max-[980px]:h-auto max-[980px]:max-h-none max-[980px]:min-h-0 max-[980px]:overflow-visible',
  panel:
    'box-border grid h-full max-h-full min-h-0 grid-rows-[minmax(0,1fr)] overflow-hidden border-2 !border-[rgba(219,175,98,0.32)] bg-[rgba(15,24,46,0.52)] p-[18px] [scrollbar-gutter:stable]',
  panelFull: 'min-h-full',
  homeGrid:
    'grid items-start gap-[18px] min-[981px]:grid-cols-[minmax(300px,0.9fr)_minmax(0,1.1fr)]',
  card:
    'mt-0 flex flex-col rounded-3xl border-2 !border-[rgba(219,175,98,0.32)] bg-[rgba(18,28,52,0.72)] p-[22px] text-[#f2f7fb] shadow-none backdrop-blur-[18px]',
  cardHeader: 'p-[22px] pb-0',
  cardTitle: 'text-[#f2f7fb]',
  cardContent: 'p-[22px] pt-4',
  detailList: 'm-0 grid gap-3 p-0',
  detailItem:
    '[&_dt]:text-[#c7d6e2] [&_dt]:[text-shadow:0_1px_12px_rgba(3,8,14,0.18)] [&_dd]:m-0 [&_dd]:font-semibold [&_dd]:text-[#f2f7fb]',
  list: 'grid h-full min-h-0 grid-rows-[minmax(0,1fr)] gap-[14px]',
  listBody:
    'grid h-full min-h-0 grid-cols-1 auto-rows-auto content-start justify-stretch gap-[14px] overflow-x-hidden overflow-y-scroll [scrollbar-gutter:stable]',
  listRow:
    'grid items-center gap-[14px] border-2 !border-[rgba(219,175,98,0.38)] bg-[rgba(28,40,74,0.88)] bg-[linear-gradient(180deg,rgba(29,42,78,0.9),rgba(28,40,74,0.88))] px-[18px] py-4 max-[980px]:grid-cols-1 max-[980px]:items-start min-[981px]:grid-cols-[minmax(0,1fr)_auto]',
  listRowMain:
    'grid gap-2 [&_span]:text-[rgba(225,230,243,0.92)] [&_strong]:text-[rgba(239,189,111,0.96)]',
  listRowSide:
    'grid min-w-[132px] items-center justify-items-end gap-2 text-[rgba(225,230,243,0.92)] max-[980px]:justify-items-start',
  actionRow:
    'flex flex-nowrap items-center justify-end gap-2.5 max-[980px]:flex-wrap max-[980px]:justify-start',
  action:
    'mt-0 inline-flex min-w-28 cursor-pointer items-center justify-center border !border-[rgba(219,175,98,0.36)] bg-[rgba(56,85,162,0.92)] bg-[linear-gradient(180deg,rgba(83,124,210,0.92),rgba(56,85,162,0.92))] px-[22px] py-2.5 text-center text-[#f5c98e] no-underline',
  actionDisabled:
    'mt-0 inline-flex min-w-28 cursor-not-allowed items-center justify-center border !border-[rgba(219,175,98,0.22)] bg-[rgba(67,74,95,0.56)] bg-[linear-gradient(180deg,rgba(92,102,126,0.56),rgba(67,74,95,0.56))] px-[22px] py-2.5 text-center text-[rgba(225,230,243,0.62)]',
};

const loadingClassNames = {
  portal: 'grid gap-[22px] text-[#f2f7fb]',
  hero: 'relative z-[1] mx-auto grid w-[min(100%,1480px)] gap-[22px]',
  main:
    'relative mx-auto w-full max-w-[1180px] overflow-hidden rounded-[32px] border !border-[rgba(246,212,136,0.28)] bg-[radial-gradient(circle_at_top_right,rgba(236,197,122,0.14),transparent_30%),linear-gradient(180deg,rgba(20,39,58,0.95),rgba(8,18,29,0.9))] px-11 pb-10 pt-[42px] shadow-[0_32px_90px_rgba(0,0,0,0.34)] backdrop-blur-[18px] before:pointer-events-none before:absolute before:inset-2.5 before:rounded-[26px] before:border before:!border-[rgba(255,240,209,0.08)]',
  eyebrow:
    'relative z-[1] m-0 text-[0.82rem] uppercase tracking-[0.16em] text-[#ecc57a]',
  title:
    'relative z-[1] my-3 max-w-none whitespace-nowrap text-[clamp(2.6rem,4vw,4.3rem)] leading-[0.98] tracking-[-0.04em] text-[#f2f7fb] [text-shadow:0_10px_28px_rgba(3,8,14,0.34)] max-[980px]:whitespace-normal max-[980px]:text-[clamp(2.3rem,10vw,3.6rem)]',
  summary:
    'relative z-[1] m-0 max-w-[72ch] leading-[1.8] text-[#c7d6e2] [text-shadow:0_1px_14px_rgba(3,8,14,0.24)]',
};

function ShellDetailCard({
  title,
  children,
}: {
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <article className={detailShellClassNames.card}>
      <div className={detailShellClassNames.cardHeader}>
        <h3 className={cx('m-0', detailShellClassNames.cardTitle)}>
          {title}
        </h3>
      </div>
      <div className={detailShellClassNames.cardContent}>{children}</div>
    </article>
  );
}

function ShellDetailList({ children }: { children: ReactNode }) {
  return (
    <DescriptionList className={detailShellClassNames.detailList}>
      {children}
    </DescriptionList>
  );
}

function ShellDetailListItem({
  label,
  value,
}: {
  label: ReactNode;
  value: ReactNode;
}) {
  return (
    <DescriptionItem
      className={detailShellClassNames.detailItem}
      label={label}
      value={value}
    />
  );
}

function PlayerDashboardLoading() {
  return (
    <div className={detailShellClassNames.page}>
      <section className={loadingClassNames.portal}>
        <section className={loadingClassNames.hero}>
          <div className={loadingClassNames.main}>
            <p className={loadingClassNames.eyebrow}>玩家主页</p>
            <h1 className={loadingClassNames.title}>正在加载玩家主页...</h1>
            <p className={loadingClassNames.summary}>
              正在同步你的个人资料、近期牌桌、历史牌谱和赛事申诉工单。
            </p>
            <LoadingProgress
              className="relative z-[1] mt-6 max-w-[420px]"
              label="玩家主页加载中"
              message="请稍候，我们正在整理你的个人数据。"
              indeterminate
              tone="warm"
            />
          </div>
        </section>
      </section>
    </div>
  );
}

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
  player: PlayerDashboardData['player'];
  dashboard: PlayerDashboardData['dashboard'];
}) {
  return (
    <div className={detailShellClassNames.homeGrid}>
      <ShellDetailCard title="个人资料">
        <ShellDetailList>
          <ShellDetailListItem label="昵称" value={player.displayName} />
          <ShellDetailListItem label="玩家 ID" value={player.playerId} />
          <ShellDetailListItem
            label="状态"
            value={getPlayerStatusLabel(player.playerStatus)}
          />
          <ShellDetailListItem
            label="ELO"
            value={typeof player.elo === 'number' ? String(player.elo) : '--'}
          />
          <ShellDetailListItem
            label="所属俱乐部"
            value={formatClubList(player.clubIds ?? [])}
          />
        </ShellDetailList>
      </ShellDetailCard>

      <ShellDetailCard title="个人数据看板">
        {dashboard.metrics.length > 0 ? (
          <div className="grid gap-5">
            <p className="m-0 text-[#c7d6e2]">{dashboard.headline}</p>
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
      </ShellDetailCard>
    </div>
  );
}

function RecentMatchesPanel({ items }: { items: RecentTableItem[] }) {
  return (
    <section className={detailShellClassNames.list}>
      <div className={detailShellClassNames.listBody}>
        {items.length > 0 ? (
          items.map((table) => (
            <article key={table.id} className={detailShellClassNames.listRow}>
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
    <section className={detailShellClassNames.list}>
      <div className={detailShellClassNames.listBody}>
        {items.length > 0 ? (
          items.map((record) => (
            <article key={record.id} className={detailShellClassNames.listRow}>
              <div className={detailShellClassNames.listRowMain}>
                <strong>{record.summary}</strong>
                <span>{`赛事 ID：${record.tournamentId}`}</span>
                <span>{`赛段 ID：${record.stageId}`}</span>
              </div>
              <div className={detailShellClassNames.listRowSide}>
                <span>{formatDateTime(record.recordedAt)}</span>
                <Link
                  className={detailShellClassNames.action}
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
    <section className={detailShellClassNames.list}>
      <div className={detailShellClassNames.listBody}>
        {items.length > 0 ? (
          items.map((appeal) => (
            <article key={appeal.id} className={detailShellClassNames.listRow}>
              <div className={detailShellClassNames.listRowMain}>
                <strong>{appeal.id}</strong>
                <span>{`牌桌 ID：${appeal.tableId}`}</span>
                <span>{appeal.description || '未填写申诉说明。'}</span>
              </div>
              <div className={detailShellClassNames.listRowSide}>
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
      return await loadPlayerDashboardData(operatorId);
    } catch {
      return null;
    }
  }, [operatorId]);

  async function handleLogout() {
    await logout();
    navigate('/public');
  }

  if (isLoading) {
    return <PlayerDashboardLoading />;
  }

  if (!data) {
    return (
      <div className={detailShellClassNames.page}>
        <section className={detailShellClassNames.shell}>
          <header className={detailShellClassNames.header}>
            <Link className={detailShellClassNames.back} to="/public">
              返回大厅
            </Link>
            <div className={detailShellClassNames.title}>玩家主页</div>
          </header>
          <div className={detailShellClassNames.frame}>
            <div className={detailShellClassNames.content}>
              <div
                className={cx(
                  detailShellClassNames.panel,
                  detailShellClassNames.panelFull,
                )}
              >
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
    <div className={detailShellClassNames.page}>
      <section className={detailShellClassNames.shell}>
        <header className={detailShellClassNames.header}>
          <Link className={detailShellClassNames.back} to="/public">
            返回大厅
          </Link>
          <div className={detailShellClassNames.title}>{`玩家：${player.displayName}`}</div>
          <div className={detailShellClassNames.headerActions}>
            <Button variant="secondary" onClick={() => void handleLogout()}>
              退出登录
            </Button>
          </div>
        </header>

        <div className={detailShellClassNames.frame}>
          <aside className={detailShellClassNames.sidebar}>
            {tabItems.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={cx(
                  detailShellClassNames.navItem,
                  activeTab === tab.id ? detailShellClassNames.navItemActive : '',
                )}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </aside>

          <div className={detailShellClassNames.content}>
            {activeTab === 'home' ? (
              <div
                className={cx(
                  detailShellClassNames.panel,
                  detailShellClassNames.panelFull,
                )}
              >
                <PlayerHomePanel player={player} dashboard={dashboard} />
              </div>
            ) : null}

            {activeTab === 'recent' ? (
              <div
                className={cx(
                  detailShellClassNames.panel,
                  detailShellClassNames.panelFull,
                )}
              >
                <RecentMatchesPanel items={recentTables} />
              </div>
            ) : null}

            {activeTab === 'history' ? (
              <div
                className={cx(
                  detailShellClassNames.panel,
                  detailShellClassNames.panelFull,
                )}
              >
                <HistoryPaifuPanel items={archivedRecords} />
              </div>
            ) : null}

            {activeTab === 'appeals' ? (
              <div
                className={cx(
                  detailShellClassNames.panel,
                  detailShellClassNames.panelFull,
                )}
              >
                <AppealTicketsPanel items={appeals} />
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
