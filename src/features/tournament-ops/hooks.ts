import { useState } from 'react';

import {
  DEFAULT_TOURNAMENT_OPS_STATE,
  normalizeTournamentOpsState,
  type LoadState,
  type TournamentDirectoryState,
  type TournamentOpsState,
} from './data';
import { useTournamentOpsDirectoryData } from './useTournamentOpsDirectoryData';
import { useTournamentOpsPanelData } from './useTournamentOpsPanelData';
export { useTournamentOpsWorkbenchState } from './useTournamentOpsWorkbenchState';
export { useTournamentTableActions } from './useTournamentTableActions';
export { useTournamentOpsWorkbenchEffects } from './useTournamentOpsWorkbenchEffects';
import type { AppealSummary, MatchRecordSummary, TournamentTableSummary } from '@/domain/operations';

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
    source: 'api',
  };
}

export function useTournamentOpsState() {
  const [state, setState] = useState<TournamentOpsState>(DEFAULT_TOURNAMENT_OPS_STATE);
  return { state, setState };
}

export function useTournamentOpsData(
  state: TournamentOpsState,
  reloadKey = 0,
  directoryOverride: TournamentDirectoryState | null = null,
) {
  const directoryState = useTournamentOpsDirectoryData(reloadKey);
  const directory = directoryOverride ?? directoryState.directory;
  const isLoadingDirectory = directoryOverride ? false : directoryState.isLoadingDirectory;
  const normalizedState = directory ? normalizeTournamentOpsState(directory.items, state) : state;
  const {
    tables,
    records,
    appeals,
    isLoadingPanelData,
  } = useTournamentOpsPanelData(directory?.items ?? [], normalizedState, reloadKey);

  return {
    directory,
    tables: tables ?? (directory ? createEmptyLoadState<TournamentTableSummary>() : null),
    records: records ?? (directory ? createEmptyLoadState<MatchRecordSummary>() : null),
    appeals: appeals ?? (directory ? createEmptyLoadState<AppealSummary>() : null),
    isLoading: isLoadingDirectory || isLoadingPanelData,
  };
}
