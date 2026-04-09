import { useState } from 'react';

import {
  DEFAULT_TOURNAMENT_OPS_STATE,
  normalizeTournamentOpsState,
  type TournamentOpsState,
} from './data';
import { useTournamentOpsDirectoryData } from './useTournamentOpsDirectoryData';
import { useTournamentOpsPanelData } from './useTournamentOpsPanelData';
export { useTournamentOpsWorkbenchState } from './useTournamentOpsWorkbenchState';
export { useTournamentTableActions } from './useTournamentTableActions';
export { useTournamentOpsWorkbenchEffects } from './useTournamentOpsWorkbenchEffects';

export function useTournamentOpsState() {
  const [state, setState] = useState<TournamentOpsState>(DEFAULT_TOURNAMENT_OPS_STATE);
  return { state, setState };
}

export function useTournamentOpsData(state: TournamentOpsState, reloadKey = 0) {
  const { directory, isLoadingDirectory } = useTournamentOpsDirectoryData(reloadKey);
  const normalizedState = directory ? normalizeTournamentOpsState(directory.items, state) : state;
  const {
    tables,
    records,
    appeals,
    isLoadingPanelData,
  } = useTournamentOpsPanelData(directory?.items ?? [], normalizedState, reloadKey);

  return {
    directory,
    tables,
    records,
    appeals,
    isLoading: isLoadingDirectory || isLoadingPanelData,
  };
}
