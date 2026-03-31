import { FiltersHead, PanelHead } from '@/components/shared/panel';
import { EmptyState, LoadingCard, SourceBadge } from '@/components/shared/status';
import type { AppealSummary, MatchRecordSummary, TableStatus, TournamentTableSummary } from '@/domain/models';

import {
  formatDateTime,
  getActiveTournament,
  tournamentContexts,
  type LoadState,
  type TournamentOpsState,
} from './data';

function TablesPanel({ payload }: { payload: LoadState<TournamentTableSummary> }) {
  return (
    <article className="card panel-card">
      <PanelHead
        title="Table Queue"
        description="Read tournament stage tables first, and keep the view alive with mock fallback if backend data is missing."
        aside={<SourceBadge source={payload.source} warning={payload.warning} />}
      />
      <ul className="list">
        {payload.envelope.items.length > 0 ? (
          payload.envelope.items.map((table) => (
            <li key={table.id} className="list-row">
              <div>
                <strong>{table.tableCode}</strong>
                <span>{table.id}</span>
              </div>
              <div>
                <span>{table.status}</span>
                <span>{table.seatCount} seats</span>
              </div>
            </li>
          ))
        ) : (
          <EmptyState asListItem>No tournament tables match the current filters.</EmptyState>
        )}
      </ul>
    </article>
  );
}

function RecordsPanel({ payload }: { payload: LoadState<MatchRecordSummary> }) {
  return (
    <article className="card panel-card">
      <PanelHead
        title="Match Records"
        description="Records remain a read-oriented operations view and are good candidates for a richer table later."
        aside={<SourceBadge source={payload.source} warning={payload.warning} />}
      />
      <ul className="list">
        {payload.envelope.items.length > 0 ? (
          payload.envelope.items.map((record) => (
            <li key={record.id} className="list-row">
              <div>
                <strong>{record.id}</strong>
                <span>{record.tableId}</span>
              </div>
              <div>
                <span>{formatDateTime(record.recordedAt)}</span>
                <span>{record.summary}</span>
              </div>
            </li>
          ))
        ) : (
          <EmptyState asListItem>No records match the current tournament and stage filters.</EmptyState>
        )}
      </ul>
    </article>
  );
}

function AppealsPanel({ payload }: { payload: LoadState<AppealSummary> }) {
  return (
    <article className="card panel-card">
      <PanelHead
        title="Appeals"
        description="The appeals view is still scaffold-like, but it already reflects the backend-first queue shape we need."
        aside={<SourceBadge source={payload.source} warning={payload.warning} />}
      />
      <ul className="list">
        {payload.envelope.items.length > 0 ? (
          payload.envelope.items.map((appeal) => (
            <li key={appeal.id} className="list-row">
              <div>
                <strong>{appeal.id}</strong>
                <span>{appeal.tableId}</span>
              </div>
              <div>
                <span>{appeal.status}</span>
                <span>{appeal.verdict}</span>
              </div>
            </li>
          ))
        ) : (
          <EmptyState asListItem>No appeals match the current tournament or status filter.</EmptyState>
        )}
      </ul>
    </article>
  );
}

function MissingApiNotes() {
  return (
    <article className="card tournament-ops__note">
      <h3>Next backend contracts to unblock operations</h3>
      <p>We can already render the high-value operations views, but these endpoints would make the page less scaffold-like.</p>
      <ul className="list">
        <li className="list-row">
          <div>
            <strong>GET /tournaments</strong>
            <span>Load the top-level tournament directory instead of relying on hard-coded context.</span>
          </div>
        </li>
        <li className="list-row">
          <div>
            <strong>GET /tournaments/:id/stages</strong>
            <span>Replace the static stage list with a real backend-driven stage selector.</span>
          </div>
        </li>
        <li className="list-row">
          <div>
            <strong>GET /operators/:id/permissions</strong>
            <span>Help scope operational abilities by current operator instead of treating this page as a global workbench.</span>
          </div>
        </li>
      </ul>
    </article>
  );
}

export function TournamentOpsLoading() {
  return (
    <section className="section">
      <div className="section__header">
        <p className="eyebrow">Tournament Ops</p>
        <h2>赛事运营台</h2>
        <p>正在加载 tables、records 和 appeals 视图。</p>
      </div>
      <LoadingCard>Loading tournament operations...</LoadingCard>
    </section>
  );
}

export function TournamentOpsPageSection({
  state,
  tables,
  records,
  appeals,
  onReload,
  onStateChange,
}: {
  state: TournamentOpsState;
  tables: LoadState<TournamentTableSummary>;
  records: LoadState<MatchRecordSummary>;
  appeals: LoadState<AppealSummary>;
  onReload: () => void;
  onStateChange: (patch: Partial<TournamentOpsState>) => void;
}) {
  const activeTournament = getActiveTournament(state.tournamentId);

  return (
    <section className="section">
      <div className="section__header">
        <p className="eyebrow">Tournament Ops</p>
        <h2>赛事运营台</h2>
        <p>这一块现在已经进入 React 页面结构，保留当前 tables / records / appeals 的 backend-first + mock fallback 模式。</p>
      </div>
      <div className="card tournament-ops__controls">
        <FiltersHead title="赛事上下文" action={<button type="button" onClick={onReload}>重新加载</button>} />
        <div className="public-hall__toolbar">
          <label>
            <span>赛事</span>
            <select
              value={state.tournamentId}
              onChange={(event) => {
                const nextTournament = getActiveTournament(event.currentTarget.value);
                onStateChange({
                  tournamentId: nextTournament.id,
                  stageId: nextTournament.stages[0]?.id ?? '',
                });
              }}
            >
              {tournamentContexts.map((tournament) => (
                <option key={tournament.id} value={tournament.id}>
                  {tournament.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>阶段</span>
            <select value={state.stageId} onChange={(event) => onStateChange({ stageId: event.currentTarget.value })}>
              {activeTournament.stages.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Table status</span>
            <select
              value={state.tableStatus}
              onChange={(event) => onStateChange({ tableStatus: event.currentTarget.value as TableStatus | '' })}
            >
              <option value="">All</option>
              <option value="WaitingPreparation">WaitingPreparation</option>
              <option value="InProgress">InProgress</option>
              <option value="Scoring">Scoring</option>
              <option value="Archived">Archived</option>
              <option value="AppealPending">AppealPending</option>
            </select>
          </label>
          <label>
            <span>Player id</span>
            <input
              value={state.playerId}
              placeholder="player-123"
              onChange={(event) => onStateChange({ playerId: event.currentTarget.value.trim() })}
            />
          </label>
          <label>
            <span>Appeal status</span>
            <select
              value={state.appealStatus}
              onChange={(event) =>
                onStateChange({ appealStatus: event.currentTarget.value as AppealSummary['status'] | '' })
              }
            >
              <option value="">All</option>
              <option value="Open">Open</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
              <option value="Escalated">Escalated</option>
            </select>
          </label>
        </div>
      </div>
      <div className="tournament-ops__grid">
        <TablesPanel payload={tables} />
        <RecordsPanel payload={records} />
        <AppealsPanel payload={appeals} />
        <MissingApiNotes />
      </div>
    </section>
  );
}
