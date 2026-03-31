import { PanelHead } from '@/components/shared/panel';
import { EmptyState, SourceBadge } from '@/components/shared/status';
import { playerOptions, formatDateTime, getFallbackPlayer } from './application-data';
import { useHomeClubApplication } from './use-home-club-application';

export function HomeClubApplicationSection() {
  const { state, setState, isLoading, myApplications, changeOperator, handleSubmit, handleWithdraw, getSelectedClubName } =
    useHomeClubApplication();

  if (isLoading || !state) {
    return (
      <section className="section">
        <div className="section__header">
          <p className="eyebrow">Club Application</p>
          <h2>首页入会申请工作台</h2>
          <p>正在加载可申请俱乐部、玩家上下文和历史申请快照。</p>
        </div>
      </section>
    );
  }

  const fallbackPlayer = getFallbackPlayer(state.operatorId);
  const selectedPlayerName = state.playerContext.player?.displayName ?? fallbackPlayer.nickname;
  const application = state.application.application;
  const source = state.application.source ?? state.playerContext.source ?? state.clubs.source;
  const warning = state.application.warning ?? state.playerContext.warning ?? state.clubs.warning;

  return (
    <section className="section">
      <div className="section__header">
        <p className="eyebrow">Club Application</p>
        <h2>首页入会申请工作台</h2>
        <p>
          这块是 blueprint 首页里最接近真实业务的交互区。它串起 joinable clubs、当前玩家身份、申请提交与撤回，
          也保留了 API-first + mock fallback 的行为。
        </p>
      </div>
      <article className="card public-join-card">
        <PanelHead
          title="注册玩家申请俱乐部"
          description={
            <>
              表单会优先调用 <code>POST /clubs/:clubId/applications</code>，如果后端不可用则落到 mock，
              同时把结果写入本地 inbox bridge，方便后续在 member hub 里串起来看。
            </>
          }
          aside={<SourceBadge source={source} warning={warning} />}
        />
        <div className="public-join-card__callout">
          <strong>当前迁移状态</strong>
          <span>
            这一块已经改成 React 组件，后续可以很自然地继续抽成 feature-level hooks、shared cards 和表单组件。
          </span>
        </div>
        <div className="guest-flow__form">
          <label>
            <span>申请人</span>
            <select value={state.operatorId} onChange={(event) => void changeOperator(event.currentTarget.value)}>
              {playerOptions.map((player) => (
                <option key={player.operatorId} value={player.operatorId}>
                  {player.nickname}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>目标俱乐部</span>
            <select
              value={state.clubId}
              onChange={(event) =>
                setState((current) => (current ? { ...current, clubId: event.currentTarget.value } : current))
              }
            >
              {state.clubs.items.map((club) => (
                <option key={club.id} value={club.id}>
                  {club.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>申请留言</span>
            <textarea
              rows={4}
              value={state.message}
              onChange={(event) =>
                setState((current) => (current ? { ...current, message: event.currentTarget.value } : current))
              }
            />
          </label>
        </div>
        <div className="public-join-card__actions">
          <button type="button" className="portal-refresh" onClick={() => void handleSubmit()}>
            提交入会申请
          </button>
          <button
            type="button"
            className="portal-refresh"
            disabled={!application || application.status !== 'Pending'}
            onClick={() => void handleWithdraw()}
          >
            撤回当前申请
          </button>
        </div>
        {application ? (
          <div className="guest-flow__result">
            <strong>
              {selectedPlayerName} {'->'} {getSelectedClubName(application.clubId, state.clubs.items)}
            </strong>
            <span>状态：{application.status}</span>
            <span>申请编号：{application.id}</span>
            <span>提交时间：{formatDateTime(application.createdAt)}</span>
            <span>留言：{application.message}</span>
          </div>
        ) : (
          <div className="guest-flow__result guest-flow__result--muted">
            <span>当前申请人：{selectedPlayerName}</span>
            <span>{fallbackPlayer.note}</span>
            <span>提交后会把结果同步到本地 inbox bridge，方便之后在成员工作台继续联调。</span>
          </div>
        )}
      </article>
      <article className="card panel-card">
        <PanelHead
          title="最近申请快照"
          description="这里展示当前操作人的最近几条申请记录，来源于本地 inbox bridge，用来承接 mock 和 API 两种模式。"
        />
        <ul className="list">
          {myApplications.length > 0 ? (
            myApplications.map((item) => (
              <li key={item.id} className="list-row">
                <div>
                  <strong>{item.clubName}</strong>
                  <span>{item.message}</span>
                </div>
                <div>
                  <span>{item.status}</span>
                  <span>{formatDateTime(item.submittedAt)}</span>
                </div>
              </li>
            ))
          ) : (
            <EmptyState asListItem>当前操作人还没有申请记录，可以先在上面提交一条测试数据。</EmptyState>
          )}
        </ul>
      </article>
    </section>
  );
}
