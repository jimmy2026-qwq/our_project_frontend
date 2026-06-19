import { useCallback, useEffect, useReducer, useRef, useState } from 'react';

import { MahjongCoreGetTableAPI } from '@/api/tournament/mahjongcore';
import type { RealtimeEvent } from '@/app/realtime/RealtimeEvent';
import type { MahjongPublicEventView, MahjongTableView } from '@/objects';
import { sendAPI } from '@/system/api';

import { createMahjongTableQuery, getAcceptedEventFlashDurationMs, getMahjongErrorMessage, isLiveMahjongStatus, liveMahjongRefreshIntervalMs, parseMahjongPublicEventView, shouldOpenFinalSettlement } from '../functions/getTableMatchMahjongState';
import { useTableMatchMahjongActionSubmit } from './useTableMatchMahjongActionSubmit';
import { useTableMatchRoundAdvance } from './useTableMatchRoundAdvance';

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
  const [mahjongTable, setMahjongTable] = useState<MahjongTableView | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [acceptedEvent, setAcceptedEvent] = useState<MahjongPublicEventView | null>(null);
  const [finalSettlementTable, setFinalSettlementTable] = useState<MahjongTableView | null>(null);
  const lastSeenEventSequenceNoRef = useRef(0);
  const lastHandledFlashSequenceNoRef = useRef(0);
  const previousTableRef = useRef<MahjongTableView | null>(null);
  const [reloadKey, reload] = useReducer((value) => value + 1, 0);

  const handleLoadedMahjongTable = useCallback((payload: MahjongTableView) => {
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
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadMahjongTable() {
      const isInitialLoad = previousTableRef.current === null;

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
          handleLoadedMahjongTable(payload);
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
  }, [handleLoadedMahjongTable, operatorId, reloadKey, tableId, viewerPlayerId]);

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

  const submitAction = useTableMatchMahjongActionSubmit({
    lastHandledFlashSequenceNoRef,
    lastSeenEventSequenceNoRef,
    previousTableRef,
    reload,
    setAcceptedEvent,
    setActionError,
    setIsSubmittingAction,
    setMahjongTable,
    tableId,
    viewerPlayerId,
  });
  const advanceRound = useTableMatchRoundAdvance({
    operatorId,
    previousTableRef,
    reload,
    setActionError,
    setFinalSettlementTable,
    setIsRefreshing,
    setMahjongTable,
    tableId,
    viewerPlayerId,
  });

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
    acceptedEvent,
    actionError,
    advanceRound,
    clearFinalSettlement: () => setFinalSettlementTable(null),
    error,
    finalSettlementTable,
    handleRealtimeMahjongEvent,
    isLoading,
    isRefreshing,
    isSubmittingAction,
    mahjongTable,
    reload,
    submitAction,
  };
}
