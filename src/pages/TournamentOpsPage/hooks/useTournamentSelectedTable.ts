import { useMemo } from 'react';

import type { TournamentTableSummary } from '@/pages/shared_objects/tournament/TournamentTableSummary';

import type { LoadState } from '../objects/TournamentOps.types';

export function useTournamentSelectedTable(
  tables: LoadState<TournamentTableSummary> | null,
  selectedTableId: string | null,
) {
  return useMemo(
    () =>
      selectedTableId
        ? tables?.envelope.items.find((table) => table.id === selectedTableId) ??
          null
        : null,
    [selectedTableId, tables],
  ) satisfies TournamentTableSummary | null;
}
