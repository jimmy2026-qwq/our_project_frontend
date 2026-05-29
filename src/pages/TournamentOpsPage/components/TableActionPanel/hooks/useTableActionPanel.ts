import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { SeatWind } from '@/objects/tournament';
import type {
  TableDetail,
  TournamentTableSummary,
} from '@/pages/objects/TournamentViews';
import { useTournamentSeatStateSync } from './useTournamentSeatStateSync';
import { useTournamentTableActions } from './useTournamentTableActions';
import { useTournamentTableDetailData } from './useTournamentTableDetailData';

interface UseTableActionPanelParams {
  table: TournamentTableSummary | null;
  operatorId?: string;
  reloadKey: number;
  onRefresh: () => void;
}

export function useTableActionPanel({
  table,
  operatorId,
  reloadKey,
  onRefresh,
}: UseTableActionPanelParams) {
  const navigate = useNavigate();
  const [tableDetail, setTableDetail] = useState<TableDetail | null>(null);
  const [resetNote, setResetNote] = useState(
    'Reset requested from tournament ops.',
  );
  const [appealDescription, setAppealDescription] = useState('');
  const [seatWind, setSeatWind] = useState<SeatWind>('East');
  const [seatReady, setSeatReady] = useState(false);
  const [seatDisconnected, setSeatDisconnected] = useState(false);
  const [seatNote, setSeatNote] = useState('');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    setActionError(null);
  }, [table?.id]);

  useTournamentTableDetailData(reloadKey, table?.id ?? '', setTableDetail);
  useTournamentSeatStateSync({
    tableDetail,
    seatWind,
    setSeatWind,
    setSeatReady,
    setSeatDisconnected,
  });

  const actions = useTournamentTableActions({
    operatorId,
    selectedTable: table,
    tableDetail,
    seatWind,
    seatReady,
    seatDisconnected,
    seatNote,
    resetNote,
    appealDescription,
    onRefresh,
    onNavigateToTable: (tableId) => navigate(`/tables/${tableId}`),
    clearAppealDescription: () => setAppealDescription(''),
    setActionError,
    setIsSubmittingAction,
  });

  return {
    tableDetail,
    isSubmittingAction,
    actionError,
    resetNote,
    appealDescription,
    seatWind,
    seatReady,
    seatDisconnected,
    seatNote,
    onResetNoteChange: resetActionError(setResetNote, setActionError),
    onAppealDescriptionChange: resetActionError(
      setAppealDescription,
      setActionError,
    ),
    onSeatWindChange: resetActionError(setSeatWind, setActionError),
    onSeatReadyChange: resetActionError(setSeatReady, setActionError),
    onSeatDisconnectedChange: resetActionError(
      setSeatDisconnected,
      setActionError,
    ),
    onSeatNoteChange: resetActionError(setSeatNote, setActionError),
    onStartTable: () => void actions.handleStartTable(),
    onResetTable: () => void actions.handleResetTable(),
    onFileAppeal: () => void actions.handleFileAppeal(),
    onUpdateSeatState: () => void actions.handleUpdateSeatState(),
    onOpenTablePage: () => {
      if (table) {
        navigate(`/tables/${table.id}`);
      }
    },
    onOpenPaifuPage: () => {
      if (table) {
        navigate(`/tables/${table.id}/paifu`);
      }
    },
  };
}

function resetActionError<T>(
  setValue: (value: T) => void,
  setActionError: (value: string | null) => void,
) {
  return (value: T) => {
    setValue(value);
    setActionError(null);
  };
}
