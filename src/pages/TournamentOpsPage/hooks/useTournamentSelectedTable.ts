import { useMemo } from 'react';

import type { TournamentTableSummary } from '@/pages/objects/TournamentViews';

import type { LoadState } from '../objects/data';

export function useTournamentSelectedTable(
  tables: LoadState<TournamentTableSummary> | null,
  selectedTableId: string,
) {
  return useMemo(
    () =>
      tables?.envelope.items.find((table) => table.id === selectedTableId) ??
      null,
    [selectedTableId, tables],
  ) satisfies TournamentTableSummary | null;
}
