import { useEffect, type Dispatch, type SetStateAction } from 'react';

import type { TournamentTableSummary } from '@/pages/objects/tournament';

import {
  normalizeTournamentOpsState,
  type LoadState,
  type TournamentDirectoryState,
  type TournamentOpsState,
} from '../objects/data';

interface TournamentOpsSelectionSyncParams {
  directory: TournamentDirectoryState | null;
  tables: LoadState<TournamentTableSummary> | null;
  selectedTableId: string;
  setState: Dispatch<SetStateAction<TournamentOpsState>>;
  setSelectedTableId: Dispatch<SetStateAction<string>>;
}

export function useTournamentOpsSelectionSync({
  directory,
  tables,
  selectedTableId,
  setState,
  setSelectedTableId,
}: TournamentOpsSelectionSyncParams) {
  useEffect(() => {
    if (!directory?.items.length) {
      return;
    }

    setState((current) => {
      const next = normalizeTournamentOpsState(directory.items, current);

      return next.tournamentId === current.tournamentId &&
        next.stageId === current.stageId
        ? current
        : next;
    });
  }, [directory, setState]);

  useEffect(() => {
    if (!tables) {
      return;
    }

    const selectedTableStillExists = tables.envelope.items.some(
      (table) => table.id === selectedTableId,
    );

    if (selectedTableStillExists) {
      return;
    }

    const preferredTable =
      tables.envelope.items.find(
        (table) => table.status === 'WaitingPreparation',
      ) ??
      tables.envelope.items[0] ??
      null;

    setSelectedTableId(preferredTable?.id ?? '');
  }, [selectedTableId, setSelectedTableId, tables]);
}
