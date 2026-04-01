import { DataPanel, DataTablePanel, ListRow } from '@/components/shared/data-display';
import { WorkbenchBacklogPanel, WorkbenchContextPanel } from '@/components/shared/domain';
import { EmptyState, LoadingSection } from '@/components/shared/feedback';
import { SelectField, TextInputField } from '@/components/shared/forms';
import { SectionIntro } from '@/components/shared/layout';
import { TableCell, TableRow } from '@/components/ui';
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
    <DataTablePanel
      title="Match Records"
      description="Records remain a read-oriented operations view and are good candidates for a richer table later."
      source={payload.source}
      warning={payload.warning}
      headers={['Record', 'Table', 'Recorded At', 'Summary']}
      rows={payload.envelope.items.map((record) => (
        <TableRow key={record.id}>
          <TableCell>
            <strong>{record.id}</strong>
          </TableCell>
          <TableCell>{record.tableId}</TableCell>
          <TableCell>{formatDateTime(record.recordedAt)}</TableCell>
          <TableCell>{record.summary}</TableCell>
        </TableRow>
      ))}
      emptyText="No records match the current tournament and stage filters."
    />
  );
}

function AppealsPanel({ payload }: { payload: LoadState<AppealSummary> }) {
  return (
    <DataTablePanel
      title="Appeals"
      description="The appeals view is still scaffold-like, but it already reflects the backend-first queue shape we need."
      source={payload.source}
      warning={payload.warning}
      headers={['Appeal', 'Table', 'Status', 'Verdict']}
      rows={payload.envelope.items.map((appeal) => (
        <TableRow key={appeal.id}>
          <TableCell>
            <strong>{appeal.id}</strong>
          </TableCell>
          <TableCell>{appeal.tableId}</TableCell>
          <TableCell>{appeal.status}</TableCell>
          <TableCell>{appeal.verdict}</TableCell>
        </TableRow>
      ))}
      emptyText="No appeals match the current tournament or status filter."
    />
  );
}

function MissingApiNotes() {
  return (
    <WorkbenchBacklogPanel
      className="tournament-ops__note text-[color:var(--muted-strong)]"
      title="Next backend contracts to unblock operations"
      description="We can already render the high-value operations views, but these endpoints would make the page less scaffold-like."
      items={[
        {
          id: 'tournaments',
          title: 'GET /tournaments',
          detail: 'Load the top-level tournament directory instead of relying on hard-coded context.',
        },
        {
          id: 'stages',
          title: 'GET /tournaments/:id/stages',
          detail: 'Replace the static stage list with a real backend-driven stage selector.',
        },
        {
          id: 'permissions',
          title: 'GET /operators/:id/permissions',
          detail: 'Help scope operational abilities by current operator instead of treating this page as a global workbench.',
        },
      ]}
    />
  );
}

export function TournamentOpsLoading() {
  return (
    <LoadingSection
      eyebrow="Tournament Ops"
      title="Tournament Operations"
      description="Loading tables, records, and appeals views."
    >
      Loading tournament operations...
    </LoadingSection>
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

      <WorkbenchContextPanel
        className="tournament-ops__controls text-[color:var(--muted-strong)]"
        title="Tournament Context"
        description="Keep selector state local to the feature while letting the page remain route-thin."
        onReload={onReload}
      >
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
      </WorkbenchContextPanel>

      <div className="tournament-ops__grid grid gap-[18px] md:grid-cols-2">
        <TablesPanel payload={tables} />
        <RecordsPanel payload={records} />
        <AppealsPanel payload={appeals} />
        <MissingApiNotes />
      </div>
    </section>
  );
}
