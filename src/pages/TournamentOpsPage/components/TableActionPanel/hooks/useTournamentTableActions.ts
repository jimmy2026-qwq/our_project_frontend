import { AppealFileAPI } from '@/api/tournament/appeal/AppealFileAPI';
import { TournamentTableResetAPI } from '@/api/tournament/TournamentTableResetAPI';
import { TournamentTableStartAPI } from '@/api/tournament/TournamentTableStartAPI';
import { TournamentTableUpdateSeatStateAPI } from '@/api/tournament/TournamentTableUpdateSeatStateAPI';
import { useDialog } from '@/app/dialog/useDialog';

import type {
  TableDetail,
  TournamentTableSummary,
} from '@/pages/objects/TournamentViews';
import type { SeatWind } from '@/objects/tournament';
import { sendAPI } from '@/system/api';
import { useTableActionRunner } from './useTableActionRunner';
interface TournamentTableActionsParams {
  operatorId?: string;
  selectedTable: TournamentTableSummary | null;
  tableDetail: TableDetail | null;
  seatWind: SeatWind;
  seatReady: boolean;
  seatDisconnected: boolean;
  seatNote: string;
  resetNote: string;
  appealDescription: string;
  onRefresh: () => void;
  onNavigateToTable: (tableId: string) => void;
  clearAppealDescription: () => void;
  setActionError: (message: string | null) => void;
  setIsSubmittingAction: (value: boolean) => void;
}

export function useTournamentTableActions({
  operatorId,
  selectedTable,
  tableDetail,
  seatWind,
  seatReady,
  seatDisconnected,
  seatNote,
  resetNote,
  appealDescription,
  onRefresh,
  onNavigateToTable,
  clearAppealDescription,
  setActionError,
  setIsSubmittingAction,
}: TournamentTableActionsParams) {
  const { confirmDanger } = useDialog();
  const { runTableAction } = useTableActionRunner({
    onRefresh,
    setActionError,
    setIsSubmittingAction,
  });

  async function handleStartTable() {
    if (!selectedTable) {
      setActionError('Select a table first.');
      return;
    }

    const succeeded = await runTableAction(
      () =>
        sendAPI(new TournamentTableStartAPI(selectedTable.id, { operatorId })),
      {
        successTitle: 'Table started',
        successMessage: `${selectedTable.tableCode} has entered the match flow.`,
        fallbackTitle: 'Failed to start table',
        fallbackMessage: 'The table could not be started right now.',
      },
    );

    if (succeeded) {
      onNavigateToTable(selectedTable.id);
    }
  }
  async function handleResetTable() {
    if (!selectedTable) {
      setActionError('Select a table first.');
      return;
    }

    if (!operatorId) {
      setActionError('Operator id is unavailable for table reset.');
      return;
    }

    const note = resetNote.trim();

    if (!note) {
      setActionError('Reset note is required.');
      return;
    }

    const confirmed = await confirmDanger({
      title: 'Force reset this table?',
      message: `${selectedTable.tableCode} will be force reset and current table state may be lost.`,
      confirmText: 'Reset table',
      cancelText: 'Cancel',
    });

    if (!confirmed) {
      return;
    }

    await runTableAction(
      () =>
        sendAPI(
          new TournamentTableResetAPI(selectedTable.id, { operatorId, note }),
        ),
      {
        successTitle: 'Table reset',
        successMessage: `${selectedTable.tableCode} was reset successfully.`,
        fallbackTitle: 'Failed to reset table',
        fallbackMessage: 'The table could not be reset right now.',
      },
    );
  }
  async function handleFileAppeal() {
    if (!selectedTable) {
      setActionError('Select a table first.');
      return;
    }

    if (!operatorId) {
      setActionError('Operator id is unavailable for appeal filing.');
      return;
    }

    const description = appealDescription.trim();

    if (!description) {
      setActionError('Appeal description is required.');
      return;
    }

    const succeeded = await runTableAction(
      () =>
        sendAPI(
          new AppealFileAPI(selectedTable.id, {
            playerId: operatorId,
            description,
          }),
        ),
      {
        successTitle: 'Appeal filed',
        successMessage: `${selectedTable.tableCode} appeal was submitted.`,
        fallbackTitle: 'Failed to file appeal',
        fallbackMessage: 'The appeal could not be filed right now.',
      },
    );

    if (succeeded) {
      clearAppealDescription();
    }
  }
  async function handleUpdateSeatState() {
    if (!selectedTable) {
      setActionError('Select a table first.');
      return;
    }

    if (!operatorId) {
      setActionError('Operator id is unavailable for seat updates.');
      return;
    }

    const currentSeat = tableDetail?.seats.find(
      (seat) => seat.seat === seatWind,
    );
    const readyChanged = currentSeat?.ready !== seatReady;
    const disconnectedChanged = currentSeat?.disconnected !== seatDisconnected;

    if (!readyChanged && !disconnectedChanged) {
      setActionError('Seat state has not changed.');
      return;
    }

    await runTableAction(
      () =>
        sendAPI(
          new TournamentTableUpdateSeatStateAPI(selectedTable.id, {
            operatorId,
            seat: seatWind,
            ready: readyChanged ? seatReady : undefined,
            disconnected: disconnectedChanged ? seatDisconnected : undefined,
            note: seatNote.trim() || undefined,
          }),
        ),
      {
        successTitle: 'Seat state updated',
        successMessage: `${selectedTable.tableCode} ${seatWind} seat state was updated.`,
        fallbackTitle: 'Failed to update seat state',
        fallbackMessage: 'The seat state could not be updated right now.',
      },
    );
  }

  return {
    handleStartTable,
    handleResetTable,
    handleFileAppeal,
    handleUpdateSeatState,
  };
}
