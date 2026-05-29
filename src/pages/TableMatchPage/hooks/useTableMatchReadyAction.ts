import { useState } from 'react';

import { TournamentTableUpdateOwnReadyAPI } from '@/api/tournament';
import { useMutationNotice } from '@/app/feedback/useMutationNotice';
import { useNotice } from '@/app/feedback/useNotice';
import type {
  TournamentTableView,
  UpdateOwnTableReadyStateRequest,
} from '@/objects';
import type { TableDetail } from '@/pages/objects/TournamentViews';
import { sendAPI } from '@/system/api';
import { ApiError } from '@/system/api/http';

import { toTableDetail } from '../functions/toTableDetail';
import type { TableSeat } from '../objects/TableMatch.types';

interface TableMatchReadyActionParams {
  table: TableDetail | null;
  ownSeat: TableSeat | null;
  operatorId: string;
  setTable: (table: TableDetail) => void;
  setError: (message: string | null) => void;
}

export function useTableMatchReadyAction({
  table,
  ownSeat,
  operatorId,
  setTable,
  setError,
}: TableMatchReadyActionParams) {
  const { notifyMutationResult } = useMutationNotice();
  const { notifyWarning, notifyInfo } = useNotice();
  const [isUpdatingOwnReady, setIsUpdatingOwnReady] = useState(false);

  async function handleToggleOwnReady() {
    if (!table || !ownSeat || !operatorId) {
      notifyInfo(
        'Ready state unavailable',
        'Sign in as a seated player to update your own ready status.',
      );
      return;
    }

    try {
      setIsUpdatingOwnReady(true);
      setError(null);
      const nextTable = await updateOwnReadyState(table.id, {
        operatorId,
        ready: !ownSeat.ready,
      });
      setTable(nextTable);
      notifyMutationResult(
        { source: 'api' },
        {
          successTitle: ownSeat.ready ? 'Ready removed' : 'Ready confirmed',
          successMessage: ownSeat.ready
            ? `You are no longer marked ready at Table ${String(table.tableNo).padStart(2, '0')}.`
            : `You are marked ready at Table ${String(table.tableNo).padStart(2, '0')}.`,
          fallbackTitle: 'Ready state update unavailable',
          fallbackMessage: 'Your ready state could not be updated right now.',
        },
      );
    } catch (error) {
      const message = getReadyActionErrorMessage(error);
      setError(message);

      if (!(error instanceof ApiError)) {
        notifyWarning('Failed to update ready state', message);
      }
    } finally {
      setIsUpdatingOwnReady(false);
    }
  }

  return { isUpdatingOwnReady, handleToggleOwnReady };
}

function getReadyActionErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Failed to update your ready state.';
}

function updateOwnReadyState(
  tableId: string,
  payload: UpdateOwnTableReadyStateRequest,
) {
  return sendAPI<TournamentTableView>(
    new TournamentTableUpdateOwnReadyAPI(tableId, payload),
  ).then(toTableDetail);
}
