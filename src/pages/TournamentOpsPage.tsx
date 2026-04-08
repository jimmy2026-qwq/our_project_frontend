import { useEffect, useMemo, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { authApi } from '@/api/auth';
import { ApiError } from '@/api/http';
import { operationsApi, type SeatWind, type TableDetail } from '@/api/operations';
import { TournamentOpsLoading, TournamentOpsPageSection } from '@/features/tournament-ops/components';
import { normalizeTournamentOpsState } from '@/features/tournament-ops/data';
import { useTournamentOpsData, useTournamentOpsState } from '@/features/tournament-ops/hooks';
import { useAuth, useDialog, useMutationNotice, useNotice, useRefreshNotice } from '@/hooks';

interface TournamentOpsWorkbenchProps {
  fixedTournamentId?: string;
  hideTournamentSelect?: boolean;
  reloadKey?: number;
  canManageActions?: boolean;
}

export function TournamentOpsWorkbench({
  fixedTournamentId,
  hideTournamentSelect = false,
  reloadKey: externalReloadKey = 0,
  canManageActions,
}: TournamentOpsWorkbenchProps) {
  const navigate = useNavigate();
  const { state, setState } = useTournamentOpsState();
  const [reloadKey, forceReload] = useReducer((value) => value + 1, 0);
  const [pendingRefresh, setPendingRefresh] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState('');
  const [tableDetail, setTableDetail] = useState<TableDetail | null>(null);
  const [resetNote, setResetNote] = useState('Reset requested from tournament ops.');
  const [appealDescription, setAppealDescription] = useState('');
  const [seatWind, setSeatWind] = useState<SeatWind>('East');
  const [seatReady, setSeatReady] = useState(false);
  const [seatDisconnected, setSeatDisconnected] = useState(false);
  const [seatNote, setSeatNote] = useState('');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [playerNames, setPlayerNames] = useState<Record<string, string>>({});
  const { directory, tables, records, appeals, isLoading } = useTournamentOpsData(
    state,
    reloadKey + externalReloadKey,
  );
  const { notifyRefreshResult } = useRefreshNotice();
  const { notifyMutationResult } = useMutationNotice();
  const { notifyWarning } = useNotice();
  const { session } = useAuth();
  const { confirmDanger } = useDialog();
  const operatorId = session?.user.operatorId ?? session?.user.userId;
  const canManageTournamentActions =
    canManageActions ??
    (!!session?.user.roles.isRegisteredPlayer &&
      (session.user.roles.isSuperAdmin || session.user.roles.isTournamentAdmin));
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

    if (tables.envelope.items.some((table) => table.id === selectedTableId)) {
      return;
    }

    setSelectedTableId(tables.envelope.items[0]?.id ?? '');
  }, [selectedTableId, tables]);

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
  }, [selectedTableId, reloadKey]);

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
  }, [seatWind, tableDetail]);

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
  }, [playerNames, tables]);

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
  }, [appeals, directory, isLoading, notifyRefreshResult, pendingRefresh, records, tables]);

  const handleRefresh = () => {
    setPendingRefresh(true);
    forceReload();
  };

  async function runTableAction(
    action: () => Promise<unknown>,
    options: {
      successTitle: string;
      successMessage: string;
      fallbackTitle: string;
      fallbackMessage: string;
    },
  ) {
    try {
      setIsSubmittingAction(true);
      setActionError(null);
      await action();
      notifyMutationResult({ source: 'api' }, options);
      handleRefresh();
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
      navigate(`/tables/${selectedTable.id}`);
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
      setAppealDescription('');
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

  if (isLoading || !directory || !tables || !records || !appeals) {
    return <TournamentOpsLoading />;
  }

  return (
    <TournamentOpsPageSection
      tournaments={directory.items}
      state={state}
      tables={tables}
      records={records}
      appeals={appeals}
      selectedTableId={selectedTableId}
      playerNames={playerNames}
      operatorId={operatorId}
      canManageActions={canManageTournamentActions}
      tableDetail={tableDetail}
      isSubmittingAction={isSubmittingAction}
      actionError={actionError}
      resetNote={resetNote}
      appealDescription={appealDescription}
      seatWind={seatWind}
      seatReady={seatReady}
      seatDisconnected={seatDisconnected}
      seatNote={seatNote}
      hideTournamentSelect={hideTournamentSelect}
      onReload={handleRefresh}
      onStateChange={(patch) => setState((current) => ({ ...current, ...patch }))}
      onSelectTable={(tableId) => {
        setSelectedTableId(tableId);
        setActionError(null);
      }}
      onResetNoteChange={(value) => {
        setResetNote(value);
        setActionError(null);
      }}
      onAppealDescriptionChange={(value) => {
        setAppealDescription(value);
        setActionError(null);
      }}
      onSeatWindChange={(value) => {
        setSeatWind(value);
        setActionError(null);
      }}
      onSeatReadyChange={(value) => {
        setSeatReady(value);
        setActionError(null);
      }}
      onSeatDisconnectedChange={(value) => {
        setSeatDisconnected(value);
        setActionError(null);
      }}
      onSeatNoteChange={(value) => {
        setSeatNote(value);
        setActionError(null);
      }}
      onStartTable={() => void handleStartTable()}
      onResetTable={() => void handleResetTable()}
      onFileAppeal={() => void handleFileAppeal()}
      onUpdateSeatState={() => void handleUpdateSeatState()}
      onOpenTablePage={() => {
        if (selectedTable) {
          navigate(`/tables/${selectedTable.id}`);
        }
      }}
      onOpenPaifuPage={() => {
        if (selectedTable) {
          navigate(`/tables/${selectedTable.id}/paifu`);
        }
      }}
    />
  );
}

export function TournamentOpsPage() {
  return <TournamentOpsWorkbench />;
}
