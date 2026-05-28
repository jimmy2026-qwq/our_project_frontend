import { useReducer, useState } from 'react';

export function useTournamentOpsWorkbenchState() {
  const [reloadKey, forceReload] = useReducer((value) => value + 1, 0);
  const [pendingRefresh, setPendingRefresh] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState('');
  const [playerNames, setPlayerNames] = useState<Record<string, string>>({});

  return {
    reloadKey,
    forceReload,
    pendingRefresh,
    setPendingRefresh,
    selectedTableId,
    setSelectedTableId,
    playerNames,
    setPlayerNames,
  };
}
