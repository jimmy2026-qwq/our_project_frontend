import type { Dispatch, SetStateAction } from 'react';

import type { AppealSummary } from '@/pages/shared_objects/tournament/AppealSummary';
import type { MatchRecordSummary } from '@/pages/shared_objects/tournament/MatchRecordSummary';
import type { TournamentTableSummary } from '@/pages/shared_objects/tournament/TournamentTableSummary';

import type { LoadState } from '../objects/LoadState';
import type { TournamentDirectoryState } from '../objects/TournamentDirectoryState';
import type { TournamentOpsState } from '../objects/TournamentOpsState';
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
  selectedTableId: string | null;
  setState: Dispatch<SetStateAction<TournamentOpsState>>;
  setSelectedTableId: Dispatch<SetStateAction<string | null>>;
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
