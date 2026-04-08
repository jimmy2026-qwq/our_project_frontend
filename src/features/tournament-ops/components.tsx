import { DataPanel, DataTablePanel, ListRow } from '@/components/shared/data-display';
import { WorkbenchBacklogPanel, WorkbenchContextPanel } from '@/components/shared/domain';
import { EmptyState, LoadingSection } from '@/components/shared/feedback';
import { CheckboxField, FieldGroup, SelectField, TextInputField, TextareaField } from '@/components/shared/forms';
import { SectionIntro } from '@/components/shared/layout';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  TableCell,
  TableRow,
} from '@/components/ui';
import type { SeatWind, TableDetail } from '@/api/operations';
import type { AppealSummary, MatchRecordSummary, TableStatus, TournamentTableSummary } from '@/domain/models';

import {
  formatDateTime,
  getActiveTournament,
  type LoadState,
  type TournamentContext,
  type TournamentOpsState,
} from './data';

function getTableStatusLabel(status: TableStatus) {
  switch (status) {
    case 'WaitingPreparation':
      return '未开桌';
    case 'InProgress':
      return '对局中';
    case 'Scoring':
      return '结算中';
    case 'Archived':
      return '已结束';
    case 'AppealPending':
      return '申诉中';
    default:
      return status;
  }
}

function getTableStatusBadgeClassName(status: TableStatus) {
  switch (status) {
    case 'InProgress':
      return 'border-[rgba(114,216,209,0.28)] text-[color:var(--teal-strong)]';
    case 'WaitingPreparation':
      return 'border-[rgba(236,197,122,0.24)] text-[color:var(--gold)]';
    case 'Archived':
      return 'border-[color:var(--line)] text-[color:var(--muted-strong)]';
    case 'Scoring':
      return 'border-[rgba(126,162,246,0.24)] text-[color:#b8c8ff]';
    case 'AppealPending':
      return 'border-[rgba(244,126,126,0.28)] text-[color:#ffb1b1]';
    default:
      return '';
  }
}

function TablesPanel({
  payload,
  selectedTableId,
  onSelectTable,
  playerNames,
}: {
  payload: LoadState<TournamentTableSummary>;
  selectedTableId: string;
  onSelectTable: (tableId: string) => void;
  playerNames: Record<string, string>;
}) {
  return (
    <DataPanel
      title="Table Queue"
      description="Current tables in the selected tournament stage."
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
                  <span>
                    {table.playerIds.length > 0
                      ? table.playerIds.map((playerId) => playerNames[playerId] ?? playerId).join(', ')
                      : table.id}
                  </span>
                </>
              }
              aside={
                <>
                  <Badge variant="outline" className={getTableStatusBadgeClassName(table.status)}>
                    {getTableStatusLabel(table.status)}
                  </Badge>
                  <span>{table.seatCount} seats</span>
                  <Button
                    size="sm"
                    variant={selectedTableId === table.id ? 'secondary' : 'outline'}
                    onClick={() => onSelectTable(table.id)}
                  >
                    {selectedTableId === table.id ? 'Selected' : 'Operate'}
                  </Button>
                </>
              }
            />
          ))
        ) : (
          <EmptyState asListItem>No tables matched the current filters.</EmptyState>
        )}
      </ul>
    </DataPanel>
  );
}

function TableActionPanel({
  table,
  tableDetail,
  operatorId,
  canManageActions,
  isSubmitting,
  error,
  resetNote,
  appealDescription,
  seatWind,
  seatReady,
  seatDisconnected,
  seatNote,
  onResetNoteChange,
  onAppealDescriptionChange,
  onSeatWindChange,
  onSeatReadyChange,
  onSeatDisconnectedChange,
  onSeatNoteChange,
  onStartTable,
  onResetTable,
  onFileAppeal,
  onUpdateSeatState,
  onOpenTablePage,
  onOpenPaifuPage,
  playerNames,
}: {
  table: TournamentTableSummary | null;
  tableDetail: TableDetail | null;
  operatorId?: string;
  canManageActions: boolean;
  isSubmitting: boolean;
  error?: string | null;
  resetNote: string;
  appealDescription: string;
  seatWind: SeatWind;
  seatReady: boolean;
  seatDisconnected: boolean;
  seatNote: string;
  onResetNoteChange: (value: string) => void;
  onAppealDescriptionChange: (value: string) => void;
  onSeatWindChange: (value: SeatWind) => void;
  onSeatReadyChange: (value: boolean) => void;
  onSeatDisconnectedChange: (value: boolean) => void;
  onSeatNoteChange: (value: string) => void;
  onStartTable: () => void;
  onResetTable: () => void;
  onFileAppeal: () => void;
  onUpdateSeatState: () => void;
  onOpenTablePage: () => void;
  onOpenPaifuPage: () => void;
  playerNames: Record<string, string>;
}) {
  const canOperate = Boolean(table && operatorId && canManageActions);
  const playerLabel = table?.playerIds?.length
    ? table.playerIds.map((playerId) => playerNames[playerId] ?? playerId).join(', ')
    : 'Players unavailable';
  const selectedSeat = tableDetail?.seats.find((seat) => seat.seat === seatWind) ?? null;
  const isWaitingTable = table?.status === 'WaitingPreparation';
  const isArchivedTable = table?.status === 'Archived';
  const isStartedTable = Boolean(table && !isWaitingTable && !isArchivedTable);

  return (
    <Card className="tournament-ops__actions">
      <CardHeader>
        <CardTitle>Table Actions</CardTitle>
        <CardDescription>
          {isWaitingTable
            ? 'Start the table, reset it, file an appeal, or update seat readiness.'
            : isArchivedTable
              ? 'This table has already ended. Open the archived paifu to review the match result.'
              : 'This table is already in progress or post-game flow. Continue from the match page.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {table ? (
          <div className="grid gap-1 text-[color:var(--muted-strong)]">
            <strong>{table.tableCode}</strong>
            <span>{table.id}</span>
            <span>
              {getTableStatusLabel(table.status)} / {table.seatCount} seats / {playerLabel}
            </span>
          </div>
        ) : (
          <EmptyState asListItem={false}>Choose a table from the queue to unlock actions.</EmptyState>
        )}

        {!operatorId && canManageActions ? (
          <Alert variant="warning">
            <AlertTitle>Operator id unavailable</AlertTitle>
            <AlertDescription>Log in with a registered account before using tournament operations.</AlertDescription>
          </Alert>
        ) : null}

        {!canManageActions ? (
          <Alert variant="warning">
            <AlertTitle>Read-only tournament view</AlertTitle>
            <AlertDescription>
              Registered players can review table assignments, enter active match pages, and open archived paifu here.
              Seat readiness, table start, and appeal handling remain available only to tournament administrators.
            </AlertDescription>
          </Alert>
        ) : null}

        {error ? (
          <Alert variant="danger">
            <AlertTitle>Action failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {isWaitingTable ? (
          <>
            <FieldGroup>
              <SelectField
                label="Seat"
                value={seatWind}
                onChange={(event) => onSeatWindChange(event.currentTarget.value as SeatWind)}
                disabled={!canOperate || isSubmitting}
              >
                <option value="East">East</option>
                <option value="South">South</option>
                <option value="West">West</option>
                <option value="North">North</option>
              </SelectField>
              {selectedSeat ? (
                <div className="grid gap-1 text-[color:var(--muted-strong)]">
                  <strong>{selectedSeat.seat}</strong>
                  <span>Player: {selectedSeat.playerId}</span>
                  <span>
                    Ready: {selectedSeat.ready ? 'Yes' : 'No'} / Disconnected: {selectedSeat.disconnected ? 'Yes' : 'No'}
                  </span>
                </div>
              ) : null}
              <div className="grid gap-3 sm:grid-cols-2">
                <CheckboxField
                  label="Ready"
                  checked={seatReady}
                  onChange={(event) => onSeatReadyChange(event.currentTarget.checked)}
                  disabled={!canOperate || isSubmitting}
                />
                <CheckboxField
                  label="Disconnected"
                  checked={seatDisconnected}
                  onChange={(event) => onSeatDisconnectedChange(event.currentTarget.checked)}
                  disabled={!canOperate || isSubmitting}
                />
              </div>
              <TextareaField
                label="Seat update note"
                value={seatNote}
                placeholder="Optional note for the seat state change."
                onChange={(event) => onSeatNoteChange(event.currentTarget.value)}
                rows={3}
                disabled={!canOperate || isSubmitting}
              />
              <Button variant="secondary" onClick={onUpdateSeatState} disabled={!canOperate || isSubmitting}>
                Update seat state
              </Button>
              <TextareaField
                label="Reset note"
                value={resetNote}
                placeholder="Why are you force resetting this table?"
                onChange={(event) => onResetNoteChange(event.currentTarget.value)}
                rows={3}
                disabled={!canOperate || isSubmitting}
              />
              <TextareaField
                label="Appeal description"
                value={appealDescription}
                placeholder="Describe the issue that should be reviewed."
                onChange={(event) => onAppealDescriptionChange(event.currentTarget.value)}
                rows={4}
                disabled={!canOperate || isSubmitting}
              />
            </FieldGroup>

            <div className="flex flex-wrap gap-3">
              <Button onClick={onStartTable} disabled={!canOperate || isSubmitting}>
                Start table
              </Button>
              <Button variant="danger" onClick={onResetTable} disabled={!canOperate || isSubmitting}>
                Force reset
              </Button>
              <Button variant="outline" onClick={onFileAppeal} disabled={!canOperate || isSubmitting}>
                File appeal
              </Button>
            </div>
          </>
        ) : null}

        {isStartedTable ? (
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={onOpenTablePage} disabled={!table}>
              Enter match page
            </Button>
          </div>
        ) : null}

        {isArchivedTable ? (
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={onOpenPaifuPage} disabled={!table}>
              View paifu
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function RecordsPanel({ payload }: { payload: LoadState<MatchRecordSummary> }) {
  return (
    <DataTablePanel
      title="Match Records"
      description="Recent records related to the active tournament stage."
      source={payload.source}
      warning={payload.warning}
      headers={['Record', 'Table', 'Recorded at', 'Summary']}
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
      emptyText="No match records were returned for the current filters."
    />
  );
}

function AppealsPanel({ payload }: { payload: LoadState<AppealSummary> }) {
  return (
    <DataTablePanel
      title="Appeals"
      description="Open and historical appeals for the selected tournament."
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
      emptyText="No appeals were returned for the current filters."
    />
  );
}

function MissingApiNotes() {
  return (
    <WorkbenchBacklogPanel
      className="tournament-ops__note text-[color:var(--muted-strong)]"
      title="Permission Visibility"
      description="The frontend currently checks coarse auth roles. Tournament-scoped permission visibility can be tightened when an operator permission endpoint is available."
      items={[
        {
          id: 'permissions',
          title: 'GET /operators/:id/permissions',
          detail: 'A dedicated permission snapshot would let the frontend hide or reveal tournament tools more precisely.',
        },
      ]}
    />
  );
}

export function TournamentOpsLoading() {
  return (
    <LoadingSection
      eyebrow="Tournament Ops"
      title="Loading tournament operations"
      description="Preparing tables, records, and appeal workflows."
    >
      Loading tournament operations...
    </LoadingSection>
  );
}

export function TournamentOpsPageSection({
  tournaments,
  state,
  tables,
  records,
  appeals,
  selectedTableId,
  playerNames,
  operatorId,
  canManageActions,
  isSubmittingAction,
  actionError,
  resetNote,
  appealDescription,
  tableDetail,
  seatWind,
  seatReady,
  seatDisconnected,
  seatNote,
  onReload,
  onStateChange,
  onSelectTable,
  onResetNoteChange,
  onAppealDescriptionChange,
  onSeatWindChange,
  onSeatReadyChange,
  onSeatDisconnectedChange,
  onSeatNoteChange,
  onStartTable,
  onResetTable,
  onFileAppeal,
  onUpdateSeatState,
  onOpenTablePage,
  onOpenPaifuPage,
  hideTournamentSelect = false,
}: {
  tournaments: TournamentContext[];
  state: TournamentOpsState;
  tables: LoadState<TournamentTableSummary>;
  records: LoadState<MatchRecordSummary>;
  appeals: LoadState<AppealSummary>;
  selectedTableId: string;
  playerNames: Record<string, string>;
  operatorId?: string;
  canManageActions: boolean;
  tableDetail: TableDetail | null;
  isSubmittingAction: boolean;
  actionError?: string | null;
  resetNote: string;
  appealDescription: string;
  seatWind: SeatWind;
  seatReady: boolean;
  seatDisconnected: boolean;
  seatNote: string;
  onReload: () => void;
  onStateChange: (patch: Partial<TournamentOpsState>) => void;
  onSelectTable: (tableId: string) => void;
  onResetNoteChange: (value: string) => void;
  onAppealDescriptionChange: (value: string) => void;
  onSeatWindChange: (value: SeatWind) => void;
  onSeatReadyChange: (value: boolean) => void;
  onSeatDisconnectedChange: (value: boolean) => void;
  onSeatNoteChange: (value: string) => void;
  onStartTable: () => void;
  onResetTable: () => void;
  onFileAppeal: () => void;
  onUpdateSeatState: () => void;
  onOpenTablePage: () => void;
  onOpenPaifuPage: () => void;
  hideTournamentSelect?: boolean;
}) {
  const activeTournament = getActiveTournament(tournaments, state.tournamentId);
  const selectedTable = tables.envelope.items.find((table) => table.id === selectedTableId) ?? null;

  return (
    <section className="section">
      <SectionIntro
        eyebrow="Tournament Ops"
        title="Tournament Ops"
        description="Manage current stage tables, records, appeals, and seat readiness from one workbench."
      />

      <WorkbenchContextPanel
        className="tournament-ops__controls text-[color:var(--muted-strong)]"
        title="Context"
        description="Choose the stage and narrow the active table, player, and appeal views."
        onReload={onReload}
      >
        {!hideTournamentSelect ? (
          <SelectField
            label="Tournament"
            value={state.tournamentId}
            onChange={(event) => {
              const nextTournament = getActiveTournament(tournaments, event.currentTarget.value);
              onStateChange({
                tournamentId: nextTournament.id,
                stageId: nextTournament.stages[0]?.id ?? '',
              });
            }}
          >
            {tournaments.map((tournament) => (
              <option key={tournament.id} value={tournament.id}>
                {tournament.name}
              </option>
            ))}
          </SelectField>
        ) : null}
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
          onChange={(event) => onStateChange({ appealStatus: event.currentTarget.value as AppealSummary['status'] | '' })}
        >
          <option value="">All</option>
          <option value="Open">Open</option>
          <option value="Resolved">Resolved</option>
          <option value="Rejected">Rejected</option>
          <option value="Escalated">Escalated</option>
        </SelectField>
      </WorkbenchContextPanel>

      <div className="tournament-ops__grid grid gap-[18px] md:grid-cols-2">
        <TablesPanel
          payload={tables}
          selectedTableId={selectedTableId}
          onSelectTable={onSelectTable}
          playerNames={playerNames}
        />
        <TableActionPanel
          table={selectedTable}
          tableDetail={tableDetail}
          operatorId={operatorId}
          canManageActions={canManageActions}
          isSubmitting={isSubmittingAction}
          error={actionError}
          resetNote={resetNote}
          appealDescription={appealDescription}
          seatWind={seatWind}
          seatReady={seatReady}
          seatDisconnected={seatDisconnected}
          seatNote={seatNote}
          onResetNoteChange={onResetNoteChange}
          onAppealDescriptionChange={onAppealDescriptionChange}
          onSeatWindChange={onSeatWindChange}
          onSeatReadyChange={onSeatReadyChange}
          onSeatDisconnectedChange={onSeatDisconnectedChange}
          onSeatNoteChange={onSeatNoteChange}
          onStartTable={onStartTable}
          onResetTable={onResetTable}
          onFileAppeal={onFileAppeal}
          onUpdateSeatState={onUpdateSeatState}
          onOpenTablePage={onOpenTablePage}
          onOpenPaifuPage={onOpenPaifuPage}
          playerNames={playerNames}
        />
        <RecordsPanel payload={records} />
        <AppealsPanel payload={appeals} />
        <MissingApiNotes />
      </div>
    </section>
  );
}
