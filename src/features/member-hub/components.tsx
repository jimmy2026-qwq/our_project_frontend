import { FiltersHead, PanelHead } from '@/components/shared/panel';
import { EmptyState, LoadingCard, SourceBadge } from '@/components/shared/status';
import { mockClubs } from '@/mocks/overview';

import {
  formatDateTime,
  getActiveOperator,
  type ApplicationInboxState,
  type DashboardLoadState,
  type MemberHubState,
} from './data';

function DashboardMetrics({ payload }: { payload: DashboardLoadState }) {
  if (!payload.dashboard) {
    return <EmptyState>当前没有可展示的 dashboard 数据。</EmptyState>;
  }

  return (
    <>
      <p>{payload.dashboard.headline}</p>
      <div className="metric-grid">
        {payload.dashboard.metrics.map((metric) => (
          <div key={metric.label} className={`metric metric--${metric.accent ?? 'default'}`}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </div>
        ))}
      </div>
    </>
  );
}

function DashboardPlaceholder({
  title,
  path,
  payload,
  roleNote,
}: {
  title: string;
  path: string;
  payload: DashboardLoadState;
  roleNote: string;
}) {
  return (
    <article className="card dashboard-card dashboard-card--pending">
      <PanelHead title={title} description={path} aside={<SourceBadge source={payload.source} warning={payload.warning} />} />
      <p>
        这一块现在仍然保留“API 成功则展示真实 dashboard，失败则展示说明性占位”的模式，方便我们在迁移架构时保持联调信息不丢。
      </p>
      <EmptyState>{roleNote}</EmptyState>
    </article>
  );
}

export function MemberHubLoading() {
  return (
    <section className="section">
      <div className="section__header">
        <p className="eyebrow">Member Hub</p>
        <h2>成员工作台</h2>
        <p>正在加载操作人上下文、dashboard 和申请 inbox。</p>
      </div>
      <LoadingCard>Loading member hub...</LoadingCard>
    </section>
  );
}

export function MemberHubPageSection({
  state,
  playerPayload,
  clubPayload,
  inboxPayload,
  onReload,
  onChangeOperator,
  onChangePlayer,
  onChangeClub,
  onReview,
}: {
  state: MemberHubState;
  playerPayload: DashboardLoadState;
  clubPayload: DashboardLoadState;
  inboxPayload: ApplicationInboxState;
  onReload: () => void;
  onChangeOperator: (operatorId: string) => void;
  onChangePlayer: (playerId: string) => void;
  onChangeClub: (clubId: string) => void;
  onReview: (applicationId: string, decision: 'approve' | 'reject') => void;
}) {
  const activeOperator = getActiveOperator(state.operatorId);
  const pendingCount = inboxPayload.items.filter((item) => item.status === 'Pending').length;

  return (
    <section className="section">
      <div className="section__header">
        <p className="eyebrow">Member Hub</p>
        <h2>成员工作台</h2>
        <p>
          这块现在已经进入 React 页面编排，核心围绕操作人切换、player/club dashboard 和 club application inbox 展开。
        </p>
      </div>
      <div className="card member-hub__controls">
        <FiltersHead title="工作台上下文" action={<button type="button" onClick={onReload}>重新加载</button>} />
        <div className="public-hall__toolbar">
          <label>
            <span>操作人</span>
            <select value={state.operatorId} onChange={(event) => onChangeOperator(event.currentTarget.value)}>
              <option value="player-registered-1">Aoi / Registered Player</option>
              <option value="player-admin">Saki / Club Admin</option>
            </select>
          </label>
          <label>
            <span>玩家视角</span>
            <select value={state.playerId} onChange={(event) => onChangePlayer(event.currentTarget.value)}>
              <option value="player-registered-1">Aoi</option>
              <option value="player-registered-2">Mika</option>
            </select>
          </label>
          <label>
            <span>管理俱乐部</span>
            <select value={state.clubId} onChange={(event) => onChangeClub(event.currentTarget.value)}>
              {mockClubs.map((club) => {
                const disabled =
                  activeOperator.role !== 'ClubAdmin' || !activeOperator.managedClubIds.includes(club.id);

                return (
                  <option key={club.id} value={club.id} disabled={disabled}>
                    {club.name}
                  </option>
                );
              })}
            </select>
          </label>
        </div>
      </div>
      <div className="member-hub__grid">
        {activeOperator.role !== 'ClubAdmin' ? (
          <article className="card panel-card">
            <PanelHead title="入会申请 Inbox" description="只有 club admin 角色才会读取待审核申请队列。" />
            <EmptyState>当前操作人不是 Club Admin，所以这里只显示说明性占位。</EmptyState>
          </article>
        ) : (
          <article className="card panel-card">
            <PanelHead
              title="入会申请 Inbox"
              description="优先读取后端待审队列，失败时回退到本地 inbox bridge。"
              aside={<SourceBadge source={inboxPayload.source} warning={inboxPayload.warning} label={`Pending ${pendingCount}`} />}
            />
            <ul className="list">
              {inboxPayload.items.length > 0 ? (
                inboxPayload.items.map((item) => (
                  <li key={item.applicationId} className="list-row">
                    <div>
                      <strong>{item.applicant.displayName}</strong>
                      <span>{item.message}</span>
                      <span>{formatDateTime(item.submittedAt)}</span>
                    </div>
                    <div>
                      <span>{item.status}</span>
                      <span>{item.applicant.playerId}</span>
                      {item.canReview && item.status === 'Pending' ? (
                        <div className="inline-actions">
                          <button type="button" className="portal-refresh" onClick={() => onReview(item.applicationId, 'approve')}>
                            批准
                          </button>
                          <button type="button" className="portal-refresh" onClick={() => onReview(item.applicationId, 'reject')}>
                            拒绝
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </li>
                ))
              ) : (
                <EmptyState asListItem>当前没有待处理申请，可以先从首页提交一条测试记录。</EmptyState>
              )}
            </ul>
          </article>
        )}
      </div>
      <div className="member-hub__grid">
        {playerPayload.source === 'api' && playerPayload.dashboard ? (
          <article className="card dashboard-card">
            <div className="public-hall__panel-head">
              <div>
                <h3>玩家 Dashboard</h3>
                <p>{`/dashboards/players/${state.playerId}?operatorId=${state.operatorId}`}</p>
              </div>
              <SourceBadge source={playerPayload.source} warning={playerPayload.warning} />
            </div>
            <DashboardMetrics payload={playerPayload} />
          </article>
        ) : (
          <DashboardPlaceholder
            title="玩家 Dashboard"
            path={`/dashboards/players/${state.playerId}?operatorId=${state.operatorId}`}
            payload={playerPayload}
            roleNote="当前即使真实 dashboard 没有返回，也会保留工作台说明和 mock/fallback 信息。"
          />
        )}
        {activeOperator.role === 'ClubAdmin' && clubPayload.source === 'api' && clubPayload.dashboard ? (
          <article className="card dashboard-card">
            <div className="public-hall__panel-head">
              <div>
                <h3>俱乐部 Dashboard</h3>
                <p>{`/dashboards/clubs/${state.clubId}?operatorId=${state.operatorId}`}</p>
              </div>
              <SourceBadge source={clubPayload.source} warning={clubPayload.warning} />
            </div>
            <DashboardMetrics payload={clubPayload} />
          </article>
        ) : (
          <DashboardPlaceholder
            title="俱乐部 Dashboard"
            path={`/dashboards/clubs/${state.clubId}?operatorId=${state.operatorId}`}
            payload={clubPayload}
            roleNote={
              activeOperator.role === 'ClubAdmin'
                ? '当前保留 club dashboard 的占位说明，方便后续继续对齐真实管理域接口。'
                : '当前操作人不是 Club Admin，所以不会展示真实 club dashboard。'
            }
          />
        )}
      </div>
    </section>
  );
}
