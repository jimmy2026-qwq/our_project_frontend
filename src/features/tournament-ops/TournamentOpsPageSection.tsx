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
        eyebrow="赛事运营"
        title="赛事运营"
        description="在一个工作台里查看当前阶段的对局、记录、申诉和准备状态。"
      />

      <WorkbenchContextPanel
        className="tournament-ops__controls text-[color:var(--muted-strong)]"
        title="筛选条件"
        description="选择阶段，并按牌桌、玩家和申诉条件筛选当前视图。"
        onReload={onReload}
      >
        {!hideTournamentSelect ? (
          <SelectField
            label="赛事"
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
        <SelectField label="阶段" value={state.stageId} onChange={(event) => onStateChange({ stageId: event.currentTarget.value })}>
          {activeTournament.stages.map((stage) => (
            <option key={stage.id} value={stage.id}>
              {stage.name}
            </option>
          ))}
        </SelectField>
        <SelectField
          label="牌桌状态"
          value={state.tableStatus}
          onChange={(event) => onStateChange({ tableStatus: event.currentTarget.value as TableStatus | '' })}
        >
          <option value="">全部</option>
          <option value="WaitingPreparation">等待开始</option>
          <option value="InProgress">对局中</option>
          <option value="Scoring">结算中</option>
          <option value="Archived">已结束</option>
          <option value="AppealPending">申诉处理中</option>
        </SelectField>
        <TextInputField
          label="玩家编号"
          value={state.playerId}
          placeholder="player-123"
          onChange={(event) => onStateChange({ playerId: event.currentTarget.value.trim() })}
        />
        <SelectField
          label="申诉状态"
          value={state.appealStatus}
          onChange={(event) => onStateChange({ appealStatus: event.currentTarget.value as AppealSummary['status'] | '' })}
        >
          <option value="">全部</option>
          <option value="Open">处理中</option>
          <option value="Resolved">已处理</option>
          <option value="Rejected">已驳回</option>
          <option value="Escalated">已升级</option>
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
