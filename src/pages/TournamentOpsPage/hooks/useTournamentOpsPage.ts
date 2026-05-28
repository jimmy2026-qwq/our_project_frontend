import { useAuth } from '@/app/auth/useAuth';
import type {
  AppealSummary,
  MatchRecordSummary,
  TournamentTableSummary,
} from '@/pages/objects/tournament';
import {
  getActiveTournament,
  type LoadState,
  type TournamentOpsState,
} from '../objects/data';
import {
  useTournamentOpsData,
  useTournamentOpsState,
} from './useTournamentOpsData';
import { useTournamentOpsWorkbenchEffects } from './useTournamentOpsWorkbenchEffects';
import { useTournamentOpsWorkbenchState } from './useTournamentOpsWorkbenchState';

export function useTournamentOpsPage() {
  const { session } = useAuth();
  const operatorId = session?.user.operatorId ?? session?.user.userId ?? '';
  const canManageActions =
    !!session?.user.roles.isRegisteredPlayer &&
    (session.user.roles.isSuperAdmin || session.user.roles.isTournamentAdmin);
  const shouldRedirectToPublic =
    !session?.user.roles.isSuperAdmin &&
    !session?.user.roles.isTournamentAdmin;

  const { state, setState } = useTournamentOpsState();
  const workbench = useTournamentOpsWorkbenchState();
  const { directory, tables, records, appeals, isLoading } =
    useTournamentOpsData(state, workbench.reloadKey);
  const { selectedTable } = useTournamentOpsWorkbenchEffects({
    directory,
    tables,
    records,
    appeals,
    isLoading,
    selectedTableId: workbench.selectedTableId,
    setState,
    setSelectedTableId: workbench.setSelectedTableId,
    pendingRefresh: workbench.pendingRefresh,
    setPendingRefresh: workbench.setPendingRefresh,
    playerNames: workbench.playerNames,
    setPlayerNames: workbench.setPlayerNames,
  });

  const refresh = () => {
    workbench.setPendingRefresh(true);
    workbench.forceReload();
  };

  const activeTournament = directory
    ? getActiveTournament(directory.items, state.tournamentId)
    : null;
  const isLoadingPage =
    !directory || (isLoading && !tables && !records && !appeals);

  return {
    shouldRedirectToPublic,
    isLoading: isLoadingPage,
    isEmpty: !activeTournament,
    filters: {
      tournaments: directory?.items ?? [],
      activeTournament,
      state,
      hideTournamentSelect: false,
      onReload: refresh,
      onStateChange: (patch: Partial<TournamentOpsState>) =>
        setState((current) => ({ ...current, ...patch })),
    },
    tables: {
      payload: tables ?? createEmptyLoadState<TournamentTableSummary>(),
      selectedTableId: workbench.selectedTableId,
      playerNames: workbench.playerNames,
      onSelectTable: workbench.setSelectedTableId,
    },
    action: {
      table: selectedTable,
      operatorId,
      canManageActions,
      reloadKey: workbench.reloadKey,
      onRefresh: refresh,
      playerNames: workbench.playerNames,
    },
    records: records ?? createEmptyLoadState<MatchRecordSummary>(),
    appeals: appeals ?? createEmptyLoadState<AppealSummary>(),
  };
}

function createEmptyLoadState<T>(): LoadState<T> {
  return {
    envelope: {
      items: [],
      total: 0,
      limit: 0,
      offset: 0,
      hasMore: false,
      appliedFilters: {},
    },
    source: 'api' as const,
  };
}
