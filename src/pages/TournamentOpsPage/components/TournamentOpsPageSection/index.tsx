import { EmptyState } from '@/components/ui';
import { SectionIntro } from '@/components/ui';
import type { SeatWind } from '@/objects/tournament';
import type {
  AppealSummary,
  MatchRecordSummary,
  TableDetail,
  TournamentTableSummary,
} from '@/pages/objects/tournament';

import {
  getActiveTournament,
  type LoadState,
  type TournamentContext,
  type TournamentOpsState,
} from '../../objects/data';
import { AppealsPanel } from './AppealsPanel';
import { MissingApiNotes } from './MissingApiNotes';
import { RecordsPanel } from './RecordsPanel';
import { TableActionPanel } from './TableActionPanel';
import { TablesPanel } from './TablesPanel';
import { TournamentOpsFiltersPanel } from './TournamentOpsFiltersPanel';

const tournamentOpsSectionClassName =
  'grid gap-[22px] rounded-[32px] bg-[rgba(9,21,33,0.86)] px-[30px] py-7';

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
  const selectedTable =
    tables.envelope.items.find((table) => table.id === selectedTableId) ?? null;

  if (!activeTournament) {
    return (
      <section className={tournamentOpsSectionClassName}>
        <SectionIntro
          eyebrow="Tournament Ops"
          title="Tournament Operations"
          description="This workbench now depends entirely on live backend tournament data."
        />
        <EmptyState>
          No tournament operations workspace is available right now.
        </EmptyState>
      </section>
    );
  }

  return (
    <section className={tournamentOpsSectionClassName}>
      <SectionIntro
        eyebrow="赛事运营"
        title="赛事运营"
        description="在一个工作台里查看当前阶段的对局、记录、申诉和准备状态。"
      />

      <TournamentOpsFiltersPanel
        tournaments={tournaments}
        activeTournament={activeTournament}
        state={state}
        hideTournamentSelect={hideTournamentSelect}
        onReload={onReload}
        onStateChange={onStateChange}
      />

      <div className="grid gap-[18px] md:grid-cols-2">
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
