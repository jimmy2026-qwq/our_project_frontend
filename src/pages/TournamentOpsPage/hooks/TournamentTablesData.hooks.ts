import { useEffect, useState } from 'react';

import { TournamentStageTablesAPI } from '@/api/tournament/TournamentStageTablesAPI';
import type { ListEnvelope, TableListQuery, TournamentTableView } from '@/objects';
import {
  mapTournamentTable,
  type TournamentTableSummary,
} from '@/pages/objects/tournament';
import { sendAPI } from '@/system/api';

import type { LoadState, TournamentOpsState } from '../objects/data';

export function useTournamentTablesData(
  state: TournamentOpsState,
  reloadKey: number,
  enabled: boolean,
) {
  const [tables, setTables] =
    useState<LoadState<TournamentTableSummary> | null>(null);
  const [isLoadingTables, setIsLoadingTables] = useState(true);

  useEffect(() => {
    if (!enabled) {
      setTables(null);
      setIsLoadingTables(false);
      return;
    }

    let cancelled = false;

    async function loadData() {
      setIsLoadingTables(true);
      const nextTables = await loadTables(state);

      if (!cancelled) {
        setTables(nextTables);
        setIsLoadingTables(false);
      }
    }

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [enabled, reloadKey, state]);

  return { tables, isLoadingTables };
}

async function loadTables(
  state: TournamentOpsState,
): Promise<LoadState<TournamentTableSummary>> {
  try {
    const envelope = await getTournamentTables(
      state.tournamentId,
      state.stageId,
      {
        status: state.tableStatus || undefined,
        playerId: state.playerId || undefined,
        limit: 10,
        offset: 0,
      },
    );

    return { envelope, source: 'api' };
  } catch (error) {
    return {
      ...createEmptyLoadState<TournamentTableSummary>(),
      warning:
        error instanceof Error
          ? error.message
          : 'Unable to load tournament tables.',
    };
  }
}

function getTournamentTables(
  tournamentId: string,
  stageId: string,
  filters: TableListQuery,
) {
  return sendAPI<ListEnvelope<TournamentTableView>>(
    new TournamentStageTablesAPI(tournamentId, stageId, filters),
  ).then((envelope) => ({
    ...envelope,
    items: envelope.items.map(mapTournamentTable),
  }));
}

function createEmptyLoadState<T>(): LoadState<T> {
  return {
    envelope: {
      items: [],
      total: 0,
      limit: 0,
      offset: 0,
      hasMore: false,
      appliedFilters: {},
    },
    source: 'api',
  };
}
