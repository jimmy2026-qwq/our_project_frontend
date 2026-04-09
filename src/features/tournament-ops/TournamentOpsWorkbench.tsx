import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

import { useAuth } from '@/hooks';

import type { StageContext, TournamentDirectoryState } from './data';
import {
  useTournamentOpsData,
  useTournamentOpsState,
  useTournamentOpsWorkbenchEffects,
  useTournamentOpsWorkbenchState,
  useTournamentTableActions,
} from './hooks';
import { TournamentOpsLoading } from './TournamentOpsLoading';
import { TournamentOpsPageSection } from './TournamentOpsPageSection';

interface TournamentOpsWorkbenchProps {
  fixedTournamentId?: string;
  fixedTournamentName?: string;
  fixedStages?: StageContext[];
  hideTournamentSelect?: boolean;
  reloadKey?: number;
  canManageActions?: boolean;
}

export function TournamentOpsWorkbench({
  fixedTournamentId,
  fixedTournamentName,
  fixedStages,
  hideTournamentSelect = false,
  reloadKey: externalReloadKey = 0,
  canManageActions,
}: TournamentOpsWorkbenchProps) {
  const navigate = useNavigate();
  const { state, setState } = useTournamentOpsState();
  const workbench = useTournamentOpsWorkbenchState();
  const directoryOverride = useMemo<TournamentDirectoryState | null>(() => {
    if (!fixedTournamentId || !fixedStages || fixedStages.length === 0) {
      return null;
    }

    return {
      items: [
        {
          id: fixedTournamentId,
          name: fixedTournamentName ?? fixedTournamentId,
          stages: fixedStages,
        },
      ],
      source: 'api',
    };
  }, [fixedStages, fixedTournamentId, fixedTournamentName]);
  const { directory, tables, records, appeals, isLoading } = useTournamentOpsData(
    state,
    workbench.reloadKey + externalReloadKey,
    directoryOverride,
  );
  const { session } = useAuth();
  const operatorId = session?.user.operatorId ?? session?.user.userId;
  const canManageTournamentActions =
    canManageActions ??
    (!!session?.user.roles.isRegisteredPlayer &&
      (session.user.roles.isSuperAdmin || session.user.roles.isTournamentAdmin));
  const { selectedTable } = useTournamentOpsWorkbenchEffects({
    fixedTournamentId,
    directory,
    tables,
    records,
    appeals,
    isLoading,
    reloadKey: workbench.reloadKey,
    selectedTableId: workbench.selectedTableId,
    setState,
    setSelectedTableId: workbench.setSelectedTableId,
    tableDetail: workbench.tableDetail,
    setTableDetail: workbench.setTableDetail,
    seatWind: workbench.seatWind,
    setSeatWind: workbench.setSeatWind,
    setSeatReady: workbench.setSeatReady,
    setSeatDisconnected: workbench.setSeatDisconnected,
    pendingRefresh: workbench.pendingRefresh,
    setPendingRefresh: workbench.setPendingRefresh,
    playerNames: workbench.playerNames,
    setPlayerNames: workbench.setPlayerNames,
  });

  const handleRefresh = () => {
    workbench.setPendingRefresh(true);
    workbench.forceReload();
  };

  const actions = useTournamentTableActions({
    operatorId,
    selectedTable,
    tableDetail: workbench.tableDetail,
    seatWind: workbench.seatWind,
    seatReady: workbench.seatReady,
    seatDisconnected: workbench.seatDisconnected,
    seatNote: workbench.seatNote,
    resetNote: workbench.resetNote,
    appealDescription: workbench.appealDescription,
    onRefresh: handleRefresh,
    onNavigateToTable: (tableId) => navigate(`/tables/${tableId}`),
    clearAppealDescription: () => workbench.setAppealDescription(''),
    setActionError: workbench.setActionError,
    setIsSubmittingAction: workbench.setIsSubmittingAction,
  });

  if (!directory || (isLoading && !tables && !records && !appeals)) {
    return <TournamentOpsLoading />;
  }

  const safeTables = tables ?? {
    envelope: { items: [], total: 0, limit: 0, offset: 0, hasMore: false, appliedFilters: {} },
    source: 'api' as const,
  };
  const safeRecords = records ?? {
    envelope: { items: [], total: 0, limit: 0, offset: 0, hasMore: false, appliedFilters: {} },
    source: 'api' as const,
  };
  const safeAppeals = appeals ?? {
    envelope: { items: [], total: 0, limit: 0, offset: 0, hasMore: false, appliedFilters: {} },
    source: 'api' as const,
  };

  return (
    <TournamentOpsPageSection
      tournaments={directory.items}
      state={state}
      tables={safeTables}
      records={safeRecords}
      appeals={safeAppeals}
      selectedTableId={workbench.selectedTableId}
      playerNames={workbench.playerNames}
      operatorId={operatorId}
      canManageActions={canManageTournamentActions}
      tableDetail={workbench.tableDetail}
      isSubmittingAction={workbench.isSubmittingAction}
      actionError={workbench.actionError}
      resetNote={workbench.resetNote}
      appealDescription={workbench.appealDescription}
      seatWind={workbench.seatWind}
      seatReady={workbench.seatReady}
      seatDisconnected={workbench.seatDisconnected}
      seatNote={workbench.seatNote}
      hideTournamentSelect={hideTournamentSelect}
      onReload={handleRefresh}
      onStateChange={(patch) => setState((current) => ({ ...current, ...patch }))}
      onSelectTable={(tableId) => {
        workbench.setSelectedTableId(tableId);
        workbench.setActionError(null);
      }}
      onResetNoteChange={(value) => {
        workbench.setResetNote(value);
        workbench.setActionError(null);
      }}
      onAppealDescriptionChange={(value) => {
        workbench.setAppealDescription(value);
        workbench.setActionError(null);
      }}
      onSeatWindChange={(value) => {
        workbench.setSeatWind(value);
        workbench.setActionError(null);
      }}
      onSeatReadyChange={(value) => {
        workbench.setSeatReady(value);
        workbench.setActionError(null);
      }}
      onSeatDisconnectedChange={(value) => {
        workbench.setSeatDisconnected(value);
        workbench.setActionError(null);
      }}
      onSeatNoteChange={(value) => {
        workbench.setSeatNote(value);
        workbench.setActionError(null);
      }}
      onStartTable={() => void actions.handleStartTable()}
      onResetTable={() => void actions.handleResetTable()}
      onFileAppeal={() => void actions.handleFileAppeal()}
      onUpdateSeatState={() => void actions.handleUpdateSeatState()}
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
