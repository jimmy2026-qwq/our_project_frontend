import { useState } from 'react';
import { Link } from 'react-router-dom';

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
  LoadingProgress,
  StatusPill,
} from '@/components/ui';
import { cx } from '@/components/ui/cx';
import type {
  AppealSummary,
  MatchRecordSummary,
  TournamentTableSummary,
} from '@/pages/objects/tournament';
import {
  detailShellClassNames,
  loadingClassNames,
} from './player-dashboard.styles';
import { PlayerDashboardFrame } from './player-dashboard-frame';
import { PlayerHomePanel } from './player-dashboard-home';
import type {
  PlayerDashboardData,
  RecentTableItem,
} from '../objects/data';

type PlayerDetailTab = 'home' | 'recent' | 'history' | 'appeals';

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

function getRecentTableStatusLabel(status: TournamentTableSummary['status']) {
  switch (status) {
    case 'WaitingPreparation':
      return '待准备';
    case 'InProgress':
      return '进行中';
    case 'Scoring':
      return '结算中';
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
  const [summaryRecord, setSummaryRecord] =
    useState<MatchRecordSummary | null>(null);

  return (
    <>
      <section className={detailShellClassNames.list}>
        <div className={detailShellClassNames.listBody}>
          {items.length > 0 ? (
            items.map((record) => (
              <article key={record.id} className={detailShellClassNames.listRow}>
                <div className={detailShellClassNames.listRowMain}>
                  <strong>{record.tournamentName ?? record.tournamentId}</strong>
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
              <p className="m-0 whitespace-pre-wrap leading-7 text-[#f2f7fb]">
                {summaryRecord?.summary || '暂无摘要'}
              </p>
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

export function PlayerDashboardLoading() {
  return (
    <PlayerDashboardFrame>
      <section className={loadingClassNames.portal}>
        <section className={loadingClassNames.hero}>
          <div className={loadingClassNames.main}>
            <span className={loadingClassNames.mainBorder} aria-hidden="true" />
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
    </PlayerDashboardFrame>
  );
}

export function PlayerDashboardEmpty() {
  return (
    <PlayerDashboardFrame>
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
    </PlayerDashboardFrame>
  );
}

export function PlayerDashboardShell({
  data,
  activeTab,
  onActiveTabChange,
  onLogout,
}: {
  data: PlayerDashboardData;
  activeTab: PlayerDetailTab;
  onActiveTabChange: (tab: PlayerDetailTab) => void;
  onLogout: () => void;
}) {
  const {
    player,
    playerClubs,
    dashboard,
    recentTables,
    archivedRecords,
    appeals,
  } = data;
  const tabItems: Array<{ id: PlayerDetailTab; label: string }> = [
    { id: 'home', label: '主页概览' },
    { id: 'recent', label: '近期牌桌' },
    { id: 'history', label: '历史牌谱' },
    { id: 'appeals', label: '我的工单' },
  ];

  return (
    <PlayerDashboardFrame>
      <section className={detailShellClassNames.shell}>
        <header className={detailShellClassNames.header}>
          <Link className={detailShellClassNames.back} to="/public">
            返回大厅
          </Link>
          <div className={detailShellClassNames.title}>{`玩家：${player.displayName}`}</div>
          <div className={detailShellClassNames.headerActions}>
            <Button variant="secondary" onClick={onLogout}>
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
                onClick={() => onActiveTabChange(tab.id)}
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
                <PlayerHomePanel
                  player={player}
                  playerClubs={playerClubs}
                  dashboard={dashboard}
                />
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
    </PlayerDashboardFrame>
  );
}
