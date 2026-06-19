import { useState } from 'react';

import type { AppealSummary } from '@/pages/shared_objects/tournament/AppealSummary';
import type { MatchRecordSummary } from '@/pages/shared_objects/tournament/MatchRecordSummary';
import type { TournamentTableSummary } from '@/pages/shared_objects/tournament/TournamentTableSummary';

import {
  DEFAULT_TOURNAMENT_OPS_STATE,
  type LoadState,
  type TournamentOpsState,
} from '../objects/TournamentOps.types';
import { normalizeTournamentOpsState } from '../functions/getTournamentOpsState';
import { useTournamentOpsDirectoryData } from './useTournamentOpsDirectoryData';
import { useTournamentOpsPanelData } from './useTournamentOpsPanelData';

export function useTournamentOpsState() {
  const [state, setState] = useState<TournamentOpsState>(
    DEFAULT_TOURNAMENT_OPS_STATE,
  );
  return { state, setState };
}

export function useTournamentOpsData(state: TournamentOpsState, reloadKey = 0) {
  const directoryState = useTournamentOpsDirectoryData(reloadKey);
  const directory = directoryState.directory;
  const normalizedState = directory
    ? normalizeTournamentOpsState(directory.items, state)
    : state;
  const { tables, records, appeals, isLoadingPanelData } =
    useTournamentOpsPanelData(
      directory?.items ?? [],
      normalizedState,
      reloadKey,
    );

  return {
    directory,
    tables:
      tables ??
      (directory ? createEmptyLoadState<TournamentTableSummary>() : null),
    records:
      records ??
      (directory ? createEmptyLoadState<MatchRecordSummary>() : null),
    appeals:
      appeals ?? (directory ? createEmptyLoadState<AppealSummary>() : null),
    isLoading: directoryState.isLoadingDirectory || isLoadingPanelData,
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
    source: 'api',
  };
}
