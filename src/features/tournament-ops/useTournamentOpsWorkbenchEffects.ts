import { useEffect, useMemo, type Dispatch, type SetStateAction } from 'react';

import { authApi } from '@/api/auth';
import { operationsApi } from '@/api/operations';
import { useRefreshNotice } from '@/hooks';

import {
  normalizeTournamentOpsState,
  type LoadState,
  type TournamentDirectoryState,
  type TournamentOpsState,
} from './data';
import type {
  AppealSummary,
  MatchRecordSummary,
  SeatWind,
  TableDetail,
  TournamentTableSummary,
} from '@/domain/operations';

interface TournamentOpsEffectsParams {
  fixedTournamentId?: string;
  directory: TournamentDirectoryState | null;
  tables: LoadState<TournamentTableSummary> | null;
  records: LoadState<MatchRecordSummary> | null;
  appeals: LoadState<AppealSummary> | null;
  isLoading: boolean;
  reloadKey: number;
  selectedTableId: string;
  setState: Dispatch<SetStateAction<TournamentOpsState>>;
  setSelectedTableId: Dispatch<SetStateAction<string>>;
  tableDetail: TableDetail | null;
  setTableDetail: Dispatch<SetStateAction<TableDetail | null>>;
  seatWind: SeatWind;
  setSeatWind: Dispatch<SetStateAction<SeatWind>>;
  setSeatReady: Dispatch<SetStateAction<boolean>>;
  setSeatDisconnected: Dispatch<SetStateAction<boolean>>;
  pendingRefresh: boolean;
  setPendingRefresh: Dispatch<SetStateAction<boolean>>;
  playerNames: Record<string, string>;
  setPlayerNames: Dispatch<SetStateAction<Record<string, string>>>;
}

export function useTournamentOpsWorkbenchEffects({
  fixedTournamentId,
  directory,
  tables,
  records,
  appeals,
  isLoading,
  reloadKey,
  selectedTableId,
  setState,
  setSelectedTableId,
  tableDetail,
  setTableDetail,
  seatWind,
  setSeatWind,
  setSeatReady,
  setSeatDisconnected,
  pendingRefresh,
  setPendingRefresh,
  playerNames,
  setPlayerNames,
}: TournamentOpsEffectsParams) {
  const { notifyRefreshResult } = useRefreshNotice();

  const selectedTable = useMemo(
    () => tables?.envelope.items.find((table) => table.id === selectedTableId) ?? null,
    [selectedTableId, tables],
  );

  useEffect(() => {
    if (!directory?.items.length) {
      return;
    }

    setState((current) => {
      const preferredTournamentId =
        fixedTournamentId && directory.items.some((item) => item.id === fixedTournamentId)
          ? fixedTournamentId
          : current.tournamentId;
      const next = normalizeTournamentOpsState(directory.items, {
        ...current,
        tournamentId: preferredTournamentId,
      });

      return next.tournamentId === current.tournamentId && next.stageId === current.stageId ? current : next;
    });
  }, [directory, fixedTournamentId, setState]);

  useEffect(() => {
    if (!tables) {
      return;
    }

    const selectedTableStillExists = tables.envelope.items.some((table) => table.id === selectedTableId);

    if (selectedTableStillExists) {
      return;
    }

    const preferredTable =
      tables.envelope.items.find((table) => table.status === 'WaitingPreparation') ?? tables.envelope.items[0] ?? null;

    setSelectedTableId(preferredTable?.id ?? '');
  }, [selectedTableId, setSelectedTableId, tables]);

  useEffect(() => {
    let cancelled = false;

    if (!selectedTableId) {
      setTableDetail(null);
      return () => {
        cancelled = true;
      };
    }

    void (async () => {
      try {
        const detail = await operationsApi.getTable(selectedTableId);

        if (!cancelled) {
          setTableDetail(detail);
        }
      } catch {
        if (!cancelled) {
          setTableDetail(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reloadKey, selectedTableId, setTableDetail]);

  useEffect(() => {
    const seat = tableDetail?.seats.find((item) => item.seat === seatWind) ?? tableDetail?.seats[0] ?? null;

    if (!seat) {
      setSeatReady(false);
      setSeatDisconnected(false);
      return;
    }

    if (seat.seat !== seatWind) {
      setSeatWind(seat.seat);
    }

    setSeatReady(seat.ready);
    setSeatDisconnected(seat.disconnected);
  }, [seatWind, setSeatDisconnected, setSeatReady, setSeatWind, tableDetail]);

  useEffect(() => {
    let cancelled = false;

    async function loadPlayerNames() {
      if (!tables) {
        return;
      }

      const missingPlayerIds = Array.from(
        new Set(
          tables.envelope.items.flatMap((table) => table.playerIds).filter((playerId) => !(playerId in playerNames)),
        ),
      );

      if (missingPlayerIds.length === 0) {
        return;
      }

      const entries = await Promise.all(
        missingPlayerIds.map(async (playerId) => {
          try {
            const profile = await authApi.getPlayer(playerId);
            return [playerId, profile.displayName] as const;
          } catch {
            return [playerId, playerId] as const;
          }
        }),
      );

      if (!cancelled) {
        setPlayerNames((current) => ({
          ...current,
          ...Object.fromEntries(entries),
        }));
      }
    }

    void loadPlayerNames();

    return () => {
      cancelled = true;
    };
  }, [playerNames, setPlayerNames, tables]);

  useEffect(() => {
    if (!pendingRefresh || isLoading || !directory || !tables || !records || !appeals) {
      return;
    }

    notifyRefreshResult(
      [directory, tables, records, appeals],
      {
        failureTitle: 'Tournament ops refresh failed',
        successTitle: 'Tournament ops refreshed',
        successMessage: 'Tables, records, and appeals were reloaded.',
        fallbackTitle: 'Tournament ops refreshed with fallback data',
        fallbackMessage: 'Some tournament ops panels are still using local fallback data.',
      },
    );

    setPendingRefresh(false);
  }, [appeals, directory, isLoading, notifyRefreshResult, pendingRefresh, records, setPendingRefresh, tables]);

  return { selectedTable };
}
