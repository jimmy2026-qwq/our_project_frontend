import { useCallback, useEffect, useReducer, useRef, useState } from 'react';

import {
  MahjongCoreAdvanceRoundAPI,
  MahjongCoreArchiveTableAPI,
  MahjongCoreGetTableAPI,
  MahjongCoreSubmitActionAPI,
} from '@/api/tournament/mahjongcore';
import type { RealtimeEvent } from '@/app/realtime/RealtimeEvent';
import type {
  AdvanceMahjongRoundRequest,
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
  tableId: string;
  viewerPlayerId: string;
}

export function useTableMatchMahjongState({
  operatorId,
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
  const [finalSettlementTable, setFinalSettlementTable] =
    useState<MahjongTableView | null>(null);
  const lastSeenEventSequenceNoRef = useRef(0);
  const lastHandledFlashSequenceNoRef = useRef(0);
  const previousTableRef = useRef<MahjongTableView | null>(null);
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
            nextSequenceNo > previousSequenceNo &&
            payload.lastEvent.sequenceNo !== lastHandledFlashSequenceNoRef.current
          ) {
            setAcceptedEvent(payload.lastEvent);
          }

          lastSeenEventSequenceNoRef.current = nextSequenceNo;
          if (shouldOpenFinalSettlement(previousTableRef.current, payload)) {
            setFinalSettlementTable(payload);
          }
          previousTableRef.current = payload;
          setMahjongTable(payload);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(getMahjongErrorMessage(loadError));
          if (!previousTableRef.current) {
            setMahjongTable(null);
          }
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

        if (response.acceptedEvent) {
          lastHandledFlashSequenceNoRef.current = response.acceptedEvent.sequenceNo;
        }
        setAcceptedEvent(response.acceptedEvent);
        lastSeenEventSequenceNoRef.current =
          response.table.lastEventSequenceNo ?? lastSeenEventSequenceNoRef.current;
        previousTableRef.current = response.table;
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

      const request: AdvanceMahjongRoundRequest = {};
      if (viewerPlayerId) {
        request.playerId = viewerPlayerId;
      }

      const response = await sendAPI<MahjongTableView>(
        new MahjongCoreAdvanceRoundAPI(tableId, request),
      );
      if (response.status === 'Finished') {
        setFinalSettlementTable(response);
      }
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
        previousTableRef.current = resolvedTable;
        setMahjongTable(resolvedTable);
        return;
      }

      const viewerTable = await sendAPI<MahjongTableView>(
        new MahjongCoreGetTableAPI(
          tableId,
          createMahjongTableQuery({ operatorId, viewerPlayerId }),
        ),
      );
      previousTableRef.current = viewerTable;
      setMahjongTable(viewerTable);
    } catch (advanceError) {
      setActionError(getMahjongErrorMessage(advanceError));
      reload();
    } finally {
      setIsRefreshing(false);
    }
  }, [operatorId, tableId, viewerPlayerId]);

  const handleRealtimeMahjongEvent = useCallback(
    (event: RealtimeEvent) => {
      if (
        event.eventType !== 'MahjongActionAccepted' ||
        event.aggregateType !== 'mahjongTable' ||
        event.aggregateId !== tableId
      ) {
        return false;
      }

      const acceptedAction = parseMahjongPublicEventView(event.data);

      if (
        acceptedAction &&
        acceptedAction.sequenceNo !== lastHandledFlashSequenceNoRef.current
      ) {
        lastHandledFlashSequenceNoRef.current = acceptedAction.sequenceNo;
        setAcceptedEvent(acceptedAction);
      }

      reload();
      return true;
    },
    [tableId],
  );

  return {
    advanceRound,
    actionError,
    clearFinalSettlement: () => setFinalSettlementTable(null),
    error,
    finalSettlementTable,
    isLoading,
    isRefreshing,
    isSubmittingAction,
    mahjongTable,
    acceptedEvent,
    handleRealtimeMahjongEvent,
    reload,
    submitAction,
  };
}

function shouldOpenFinalSettlement(
  previous: MahjongTableView | null,
  next: MahjongTableView,
) {
  if (!previous || !next.currentRound?.result) {
    return false;
  }

  return isTerminalMahjongStatus(next.status) && !isTerminalMahjongStatus(previous.status);
}

function getAcceptedEventFlashDurationMs(event: MahjongPublicEventView) {
  if (event.actionType === 'Win') {
    return 1000;
  }

  if (event.actionType === 'Chi' || event.actionType === 'Pon') {
    return 500;
  }

  if (event.actionType === 'Riichi') {
    return 1000;
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

function parseMahjongPublicEventView(
  value: unknown,
): MahjongPublicEventView | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    typeof value.sequenceNo !== 'number' ||
    typeof value.actionType !== 'string'
  ) {
    return null;
  }

  return {
    sequenceNo: value.sequenceNo,
    actor: typeof value.actor === 'string' ? value.actor : null,
    actionType: value.actionType as MahjongPublicEventView['actionType'],
    tile: typeof value.tile === 'string' ? value.tile : null,
    tiles: Array.isArray(value.tiles)
      ? value.tiles.filter((tile): tile is string => typeof tile === 'string')
      : [],
    note: typeof value.note === 'string' ? value.note : null,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isLiveMahjongStatus(status: MahjongTableView['status']) {
  return (
    status === 'InProgress' ||
    status === 'WaitingPlayerAction' ||
    status === 'WaitingCallDecision' ||
    status === 'RoundEnded'
  );
}

function isTerminalMahjongStatus(status: MahjongTableView['status']) {
  return status === 'Finished' || status === 'Archived';
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
