import { WorkbenchContextPanel } from '@/components/shared/domain';
import { SelectField, TextInputField } from '@/components/shared/forms';
import { SectionIntro } from '@/components/shared/layout';
import type { TableStatus } from '@/domain/common';
import type {
  AppealSummary,
  MatchRecordSummary,
  SeatWind,
  TableDetail,
  TournamentTableSummary,
} from '@/domain/operations';

import {
  getActiveTournament,
  type LoadState,
  type TournamentContext,
  type TournamentOpsState,
} from './data';
import { AppealsPanel } from './AppealsPanel';
import { MissingApiNotes } from './MissingApiNotes';
import { RecordsPanel } from './RecordsPanel';
import { TableActionPanel } from './TableActionPanel';
import { TablesPanel } from './TablesPanel';

interface TournamentOpsPageSectionProps {
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
  tableDetail,
  isSubmittingAction,
  actionError,
  resetNote,
  appealDescription,
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
}: TournamentOpsPageSectionProps) {
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
