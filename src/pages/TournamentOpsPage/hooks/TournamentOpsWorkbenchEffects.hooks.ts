import type { Dispatch, SetStateAction } from 'react';

import type { SeatWind } from '@/objects/tournament';
import type {
  AppealSummary,
  MatchRecordSummary,
  TableDetail,
  TournamentTableSummary,
} from '@/pages/objects/tournament';

import type {
  LoadState,
  TournamentDirectoryState,
  TournamentOpsState,
} from '../objects/data';
import { useTournamentOpsRefreshNotice } from './TournamentOpsRefreshNotice.hooks';
import { useTournamentOpsSelectionSync } from './TournamentOpsSelectionSync.hooks';
import { useTournamentPlayerNamesData } from './TournamentPlayerNamesData.hooks';
import { useTournamentSeatStateSync } from './TournamentSeatStateSync.hooks';
import { useTournamentSelectedTable } from './TournamentSelectedTable.hooks';
import { useTournamentTableDetailData } from './TournamentTableDetailData.hooks';

interface TournamentOpsEffectsParams {
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
  const selectedTable = useTournamentSelectedTable(tables, selectedTableId);

  useTournamentOpsSelectionSync({
    directory,
    tables,
    selectedTableId,
    setState,
    setSelectedTableId,
  });
  useTournamentTableDetailData(reloadKey, selectedTableId, setTableDetail);
  useTournamentSeatStateSync({
    tableDetail,
    seatWind,
    setSeatWind,
    setSeatReady,
    setSeatDisconnected,
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
