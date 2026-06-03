import { useCallback, useEffect, useReducer, useState } from 'react';

import {
  MahjongCoreAdvanceRoundAPI,
  MahjongCoreGetTableAPI,
  MahjongCoreSubmitActionAPI,
} from '@/api/tournament/mahjongcore';
import type {
  MahjongActionResponse,
  MahjongLegalAction,
  MahjongTableView,
  SubmitMahjongActionRequest,
} from '@/objects';
import { sendAPI } from '@/system/api';
import { ApiError } from '@/system/api/http';

interface UseTableMatchMahjongStateParams {
  operatorId: string;
  tableId: string;
}

export function useTableMatchMahjongState({
  operatorId,
  tableId,
}: UseTableMatchMahjongStateParams) {
  const [mahjongTable, setMahjongTable] = useState<MahjongTableView | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [reloadKey, reload] = useReducer((value) => value + 1, 0);

  useEffect(() => {
    let cancelled = false;

    async function loadMahjongTable() {
      const isInitialLoad = mahjongTable === null;

      try {
        if (isInitialLoad) {
          setIsLoading(true);
        } else {
          setIsRefreshing(true);
        }

        setError(null);
        const payload = await sendAPI<MahjongTableView>(
          new MahjongCoreGetTableAPI(tableId, {
            includeLegalActions: true,
            viewerPlayerId: operatorId || null,
          }),
        );

        if (!cancelled) {
          setMahjongTable(payload);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(getMahjongErrorMessage(loadError));
          setMahjongTable(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    }

    if (tableId) {
      void loadMahjongTable();
    }

    return () => {
      cancelled = true;
    };
  }, [operatorId, reloadKey, tableId]);

  useEffect(() => {
    if (!mahjongTable || !isLiveMahjongStatus(mahjongTable.status)) {
      return;
    }

    const timer = window.setInterval(() => {
      reload();
    }, 3000);

    return () => {
      window.clearInterval(timer);
    };
  }, [mahjongTable?.status]);

  const submitAction = useCallback(
    async (action: MahjongLegalAction) => {
      if (!operatorId) {
        setActionError('需要登录到选手身份后才能操作牌局。');
        return;
      }

      try {
        setIsSubmittingAction(true);
        setActionError(null);

        const request: SubmitMahjongActionRequest = {
          commandType: action.commandType,
          idempotencyKey: createIdempotencyKey(),
          playerId: operatorId,
          targetSequenceNo: action.targetSequenceNo,
          tile: action.tile,
          tiles: action.tiles,
        };
        const response = await sendAPI<MahjongActionResponse>(
          new MahjongCoreSubmitActionAPI(tableId, request),
        );

        setMahjongTable(response.table);
      } catch (submitError) {
        setActionError(getMahjongErrorMessage(submitError));
        reload();
      } finally {
        setIsSubmittingAction(false);
      }
    },
    [operatorId, tableId],
  );
  const advanceRound = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setActionError(null);

      const response = await sendAPI<MahjongTableView>(
        new MahjongCoreAdvanceRoundAPI(tableId),
      );
      setMahjongTable(response);
    } catch (advanceError) {
      setActionError(getMahjongErrorMessage(advanceError));
      reload();
    } finally {
      setIsRefreshing(false);
    }
  }, [tableId]);

  return {
    advanceRound,
    actionError,
    error,
    isLoading,
    isRefreshing,
    isSubmittingAction,
    mahjongTable,
    reload,
    submitAction,
  };
}

function isLiveMahjongStatus(status: MahjongTableView['status']) {
  return (
    status === 'InProgress' ||
    status === 'WaitingPlayerAction' ||
    status === 'WaitingCallDecision' ||
    status === 'RoundEnded'
  );
}

function createIdempotencyKey() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `action-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getMahjongErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return '牌局状态读取失败。';
}
