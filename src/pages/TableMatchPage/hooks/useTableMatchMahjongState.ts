import { useCallback, useEffect, useReducer, useRef, useState } from 'react';

import {
  MahjongCoreAdvanceRoundAPI,
  MahjongCoreArchiveTableAPI,
  MahjongCoreGetTableAPI,
  MahjongCoreSubmitActionAPI,
} from '@/api/tournament/mahjongcore';
import type {
  MahjongActionResponse,
  MahjongLegalAction,
  MahjongPublicEventView,
  MahjongTableView,
  SubmitMahjongActionRequest,
} from '@/objects';
import { sendAPI } from '@/system/api';
import { ApiError } from '@/system/api/http';

const liveMahjongRefreshIntervalMs = 1000;

interface UseTableMatchMahjongStateParams {
  operatorId: string;
  showcaseMode: boolean;
  tableId: string;
  viewerPlayerId: string;
}

export function useTableMatchMahjongState({
  operatorId,
  showcaseMode,
  tableId,
  viewerPlayerId,
}: UseTableMatchMahjongStateParams) {
  const [mahjongTable, setMahjongTable] = useState<MahjongTableView | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [acceptedEvent, setAcceptedEvent] =
    useState<MahjongPublicEventView | null>(null);
  const lastSeenEventSequenceNoRef = useRef(0);
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
          new MahjongCoreGetTableAPI(
            tableId,
            createMahjongTableQuery({ operatorId, viewerPlayerId }),
          ),
        );

        if (!cancelled) {
          const previousSequenceNo = lastSeenEventSequenceNoRef.current;
          const nextSequenceNo = payload.lastEventSequenceNo ?? 0;

          if (
            previousSequenceNo > 0 &&
            payload.lastEvent &&
            nextSequenceNo > previousSequenceNo
          ) {
            setAcceptedEvent(payload.lastEvent);
          }

          lastSeenEventSequenceNoRef.current = nextSequenceNo;
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
  }, [operatorId, reloadKey, tableId, viewerPlayerId]);

  useEffect(() => {
    if (!mahjongTable || !isLiveMahjongStatus(mahjongTable.status)) {
      return;
    }

    const timer = window.setInterval(() => {
      reload();
    }, liveMahjongRefreshIntervalMs);

    return () => {
      window.clearInterval(timer);
    };
  }, [mahjongTable?.status]);

  const submitAction = useCallback(
    async (action: MahjongLegalAction) => {
      if (!viewerPlayerId) {
        setActionError('需要登录到选手身份后才能操作牌局。');
        return;
      }

      try {
        setIsSubmittingAction(true);
        setActionError(null);

        const request: SubmitMahjongActionRequest = {
          commandType: action.commandType,
          idempotencyKey: createIdempotencyKey(),
          playerId: viewerPlayerId,
          targetSequenceNo: action.targetSequenceNo,
          tile: action.tile,
          tiles: action.tiles,
        };
        const response = await sendAPI<MahjongActionResponse>(
          new MahjongCoreSubmitActionAPI(tableId, request),
        );

        setAcceptedEvent(response.acceptedEvent);
        lastSeenEventSequenceNoRef.current =
          response.table.lastEventSequenceNo ?? lastSeenEventSequenceNoRef.current;
        setMahjongTable(response.table);
      } catch (submitError) {
        setActionError(getMahjongErrorMessage(submitError));
        reload();
      } finally {
        setIsSubmittingAction(false);
      }
    },
    [tableId, viewerPlayerId],
  );
  useEffect(() => {
    if (!acceptedEvent) {
      return;
    }

    const timer = window.setTimeout(() => {
      setAcceptedEvent(null);
    }, getAcceptedEventFlashDurationMs(acceptedEvent));

    return () => {
      window.clearTimeout(timer);
    };
  }, [acceptedEvent]);

  const advanceRound = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setActionError(null);

      const response = await sendAPI<MahjongTableView>(
        new MahjongCoreAdvanceRoundAPI(tableId, { showcaseMode }),
      );
      const resolvedTable =
        response.status === 'Finished'
          ? (
              await sendAPI<MahjongActionResponse>(
                new MahjongCoreArchiveTableAPI(tableId, {
                  operatorId: operatorId || viewerPlayerId || null,
                }),
              )
            ).table
          : response;

      if (!operatorId && !viewerPlayerId) {
        setMahjongTable(resolvedTable);
        return;
      }

      const viewerTable = await sendAPI<MahjongTableView>(
        new MahjongCoreGetTableAPI(
          tableId,
          createMahjongTableQuery({ operatorId, viewerPlayerId }),
        ),
      );
      setMahjongTable(viewerTable);
    } catch (advanceError) {
      setActionError(getMahjongErrorMessage(advanceError));
      reload();
    } finally {
      setIsRefreshing(false);
    }
  }, [operatorId, showcaseMode, tableId, viewerPlayerId]);

  return {
    advanceRound,
    actionError,
    error,
    isLoading,
    isRefreshing,
    isSubmittingAction,
    mahjongTable,
    acceptedEvent,
    reload,
    submitAction,
  };
}

function getAcceptedEventFlashDurationMs(event: MahjongPublicEventView) {
  if (event.actionType === 'Win') {
    return 1000;
  }

  if (event.actionType === 'Chi' || event.actionType === 'Pon') {
    return 500;
  }

  return 1500;
}

function createMahjongTableQuery({
  operatorId,
  viewerPlayerId,
}: {
  operatorId: string;
  viewerPlayerId: string;
}) {
  return {
    includeLegalActions: true,
    operatorId: operatorId || null,
    viewerPlayerId: viewerPlayerId || null,
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
