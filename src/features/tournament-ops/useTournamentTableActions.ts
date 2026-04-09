import { ApiError } from '@/api/http';
import { operationsApi } from '@/api/operations';
import { useDialog, useMutationNotice, useNotice } from '@/hooks';

import type { SeatWind, TableDetail, TournamentTableSummary } from '@/domain/operations';

interface TableActionNoticeOptions {
  successTitle: string;
  successMessage: string;
  fallbackTitle: string;
  fallbackMessage: string;
}

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
  const { notifyMutationResult } = useMutationNotice();
  const { notifyWarning } = useNotice();
  const { confirmDanger } = useDialog();

  async function runTableAction(
    action: () => Promise<unknown>,
    options: TableActionNoticeOptions,
  ) {
    try {
      setIsSubmittingAction(true);
      setActionError(null);
      await action();
      notifyMutationResult({ source: 'api' }, options);
      onRefresh();
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Tournament operation failed.';
      setActionError(message);

      if (!(error instanceof ApiError)) {
        notifyWarning(options.fallbackTitle, message);
      }

      return false;
    } finally {
      setIsSubmittingAction(false);
    }
  }

  async function handleStartTable() {
    if (!selectedTable) {
      setActionError('Select a table first.');
      return;
    }

    const succeeded = await runTableAction(
      () => operationsApi.startTable(selectedTable.id, { operatorId }),
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
      () => operationsApi.resetTable(selectedTable.id, { operatorId, note }),
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
      () => operationsApi.fileAppeal(selectedTable.id, { playerId: operatorId, description }),
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

    const currentSeat = tableDetail?.seats.find((seat) => seat.seat === seatWind);
    const readyChanged = currentSeat?.ready !== seatReady;
    const disconnectedChanged = currentSeat?.disconnected !== seatDisconnected;

    if (!readyChanged && !disconnectedChanged) {
      setActionError('Seat state has not changed.');
      return;
    }

    await runTableAction(
      () =>
        operationsApi.updateSeatState(selectedTable.id, {
          operatorId,
          seat: seatWind,
          ready: readyChanged ? seatReady : undefined,
          disconnected: disconnectedChanged ? seatDisconnected : undefined,
          note: seatNote.trim() || undefined,
        }),
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
