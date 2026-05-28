import type { Dispatch, SetStateAction } from 'react';

import type {
  AppealSummary,
  MatchRecordSummary,
  TournamentTableSummary,
} from '@/pages/objects/tournament';

import type {
  LoadState,
  TournamentDirectoryState,
  TournamentOpsState,
} from '../objects/data';
import { useTournamentOpsRefreshNotice } from './useTournamentOpsRefreshNotice';
import { useTournamentOpsSelectionSync } from './useTournamentOpsSelectionSync';
import { useTournamentPlayerNamesData } from './useTournamentPlayerNamesData';
import { useTournamentSelectedTable } from './useTournamentSelectedTable';

interface TournamentOpsEffectsParams {
  directory: TournamentDirectoryState | null;
  tables: LoadState<TournamentTableSummary> | null;
  records: LoadState<MatchRecordSummary> | null;
  appeals: LoadState<AppealSummary> | null;
  isLoading: boolean;
  selectedTableId: string;
  setState: Dispatch<SetStateAction<TournamentOpsState>>;
  setSelectedTableId: Dispatch<SetStateAction<string>>;
  pendingRefresh: boolean;
  setPendingRefresh: Dispatch<SetStateAction<boolean>>;
  playerNames: Record<string, string>;
  setPlayerNames: Dispatch<SetStateAction<Record<string, string>>>;
}

export function useTournamentOpsWorkbenchEffects({
  directory,
  tables,
  records,
  appeals,
  isLoading,
  selectedTableId,
  setState,
  setSelectedTableId,
  pendingRefresh,
  setPendingRefresh,
  playerNames,
  setPlayerNames,
}: TournamentOpsEffectsParams) {
  const selectedTable = useTournamentSelectedTable(tables, selectedTableId);

  useTournamentOpsSelectionSync({
    directory,
    tables,
    selectedTableId,
    setState,
    setSelectedTableId,
  });
  useTournamentPlayerNamesData(tables, playerNames, setPlayerNames);
  useTournamentOpsRefreshNotice({
    directory,
    tables,
    records,
    appeals,
    isLoading,
    pendingRefresh,
    setPendingRefresh,
  });

  return { selectedTable };
}
