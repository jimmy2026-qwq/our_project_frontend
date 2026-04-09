import { useReducer, useState } from 'react';

import type { SeatWind, TableDetail } from '@/domain/operations';

export function useTournamentOpsWorkbenchState() {
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

  return {
    reloadKey,
    forceReload,
    pendingRefresh,
    setPendingRefresh,
    selectedTableId,
    setSelectedTableId,
    tableDetail,
    setTableDetail,
    resetNote,
    setResetNote,
    appealDescription,
    setAppealDescription,
    seatWind,
    setSeatWind,
    seatReady,
    setSeatReady,
    seatDisconnected,
    setSeatDisconnected,
    seatNote,
    setSeatNote,
    isSubmittingAction,
    setIsSubmittingAction,
    actionError,
    setActionError,
    playerNames,
    setPlayerNames,
  };
}
