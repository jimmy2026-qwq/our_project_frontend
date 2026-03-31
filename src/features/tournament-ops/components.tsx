import { DataPanel, ListRow } from '@/components/shared/data-display';
import { EmptyState, LoadingCard } from '@/components/shared/feedback';
import { SelectField, TextInputField } from '@/components/shared/forms';
import { ControlToolbar, FiltersHead, SectionIntro } from '@/components/shared/layout';
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
    <DataPanel
      title="Table Queue"
      description="Read tournament stage tables first, and keep the view alive with mock fallback if backend data is missing."
      source={payload.source}
      warning={payload.warning}
    >
      <ul className="list">
        {payload.envelope.items.length > 0 ? (
          payload.envelope.items.map((table) => (
            <ListRow
              key={table.id}
              main={
                <>
                  <strong>{table.tableCode}</strong>
                  <span>{table.id}</span>
                </>
              }
              aside={
                <>
                  <span>{table.status}</span>
                  <span>{table.seatCount} seats</span>
                </>
              }
            />
          ))
        ) : (
          <EmptyState asListItem>No tournament tables match the current filters.</EmptyState>
        )}
      </ul>
    </DataPanel>
  );
}

function RecordsPanel({ payload }: { payload: LoadState<MatchRecordSummary> }) {
  return (
    <DataPanel
      title="Match Records"
      description="Records remain a read-oriented operations view and are good candidates for a richer table later."
      source={payload.source}
      warning={payload.warning}
    >
      <ul className="list">
        {payload.envelope.items.length > 0 ? (
          payload.envelope.items.map((record) => (
            <ListRow
              key={record.id}
              main={
                <>
                  <strong>{record.id}</strong>
                  <span>{record.tableId}</span>
                </>
              }
              aside={
                <>
                  <span>{formatDateTime(record.recordedAt)}</span>
                  <span>{record.summary}</span>
                </>
              }
            />
          ))
        ) : (
          <EmptyState asListItem>No records match the current tournament and stage filters.</EmptyState>
        )}
      </ul>
    </DataPanel>
  );
}

function AppealsPanel({ payload }: { payload: LoadState<AppealSummary> }) {
  return (
    <DataPanel
      title="Appeals"
      description="The appeals view is still scaffold-like, but it already reflects the backend-first queue shape we need."
      source={payload.source}
      warning={payload.warning}
    >
      <ul className="list">
        {payload.envelope.items.length > 0 ? (
          payload.envelope.items.map((appeal) => (
            <ListRow
              key={appeal.id}
              main={
                <>
                  <strong>{appeal.id}</strong>
                  <span>{appeal.tableId}</span>
                </>
              }
              aside={
                <>
                  <span>{appeal.status}</span>
                  <span>{appeal.verdict}</span>
                </>
              }
            />
          ))
        ) : (
          <EmptyState asListItem>No appeals match the current tournament or status filter.</EmptyState>
        )}
      </ul>
    </DataPanel>
  );
}

function MissingApiNotes() {
  return (
    <article className="card tournament-ops__note">
      <h3>Next backend contracts to unblock operations</h3>
      <p>We can already render the high-value operations views, but these endpoints would make the page less scaffold-like.</p>
      <ul className="list">
        <ListRow
          main={
            <>
            <strong>GET /tournaments</strong>
            <span>Load the top-level tournament directory instead of relying on hard-coded context.</span>
            </>
          }
        />
        <ListRow
          main={
            <>
            <strong>GET /tournaments/:id/stages</strong>
            <span>Replace the static stage list with a real backend-driven stage selector.</span>
            </>
          }
        />
        <ListRow
          main={
            <>
            <strong>GET /operators/:id/permissions</strong>
            <span>Help scope operational abilities by current operator instead of treating this page as a global workbench.</span>
            </>
          }
        />
      </ul>
    </article>
  );
}

export function TournamentOpsLoading() {
  return (
    <section className="section">
      <SectionIntro
        eyebrow="Tournament Ops"
        title="Tournament Operations"
        description="Loading tables, records, and appeals views."
      />
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
      <SectionIntro
        eyebrow="Tournament Ops"
        title="Tournament Operations"
        description="This feature keeps the backend-first plus mock-fallback flow, while the page-level composition stays thin."
      />

      <div className="card tournament-ops__controls">
        <FiltersHead title="Tournament Context" action={<button type="button" onClick={onReload}>Reload</button>} />
        <ControlToolbar>
          <SelectField
            label="Tournament"
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
          </SelectField>
          <SelectField label="Stage" value={state.stageId} onChange={(event) => onStateChange({ stageId: event.currentTarget.value })}>
              {activeTournament.stages.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.name}
                </option>
              ))}
          </SelectField>
          <SelectField
            label="Table status"
            value={state.tableStatus}
            onChange={(event) => onStateChange({ tableStatus: event.currentTarget.value as TableStatus | '' })}
          >
              <option value="">All</option>
              <option value="WaitingPreparation">WaitingPreparation</option>
              <option value="InProgress">InProgress</option>
              <option value="Scoring">Scoring</option>
              <option value="Archived">Archived</option>
              <option value="AppealPending">AppealPending</option>
          </SelectField>
          <TextInputField
            label="Player id"
            value={state.playerId}
            placeholder="player-123"
            onChange={(event) => onStateChange({ playerId: event.currentTarget.value.trim() })}
          />
          <SelectField
            label="Appeal status"
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
          </SelectField>
        </ControlToolbar>
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
