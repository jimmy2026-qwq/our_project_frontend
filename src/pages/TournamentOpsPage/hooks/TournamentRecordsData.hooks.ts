import { useEffect, useState } from 'react';

import { TournamentRecordListAPI } from '@/api/tournament/TournamentRecordListAPI';
import type {
  ListEnvelope,
  MatchRecordListQuery,
  TournamentMatchRecordView,
} from '@/objects';
import {
  mapMatchRecordSummary,
  type MatchRecordSummary,
} from '@/pages/objects/tournament';
import { sendAPI } from '@/system/api';

import type { LoadState, TournamentOpsState } from '../objects/data';

export function useTournamentRecordsData(
  state: TournamentOpsState,
  reloadKey: number,
  enabled: boolean,
) {
  const [records, setRecords] = useState<LoadState<MatchRecordSummary> | null>(
    null,
  );
  const [isLoadingRecords, setIsLoadingRecords] = useState(true);

  useEffect(() => {
    if (!enabled) {
      setRecords(null);
      setIsLoadingRecords(false);
      return;
    }

    let cancelled = false;

    async function loadData() {
      setIsLoadingRecords(true);
      const nextRecords = await loadRecords(state);

      if (!cancelled) {
        setRecords(nextRecords);
        setIsLoadingRecords(false);
      }
    }

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [enabled, reloadKey, state]);

  return { records, isLoadingRecords };
}

async function loadRecords(
  state: TournamentOpsState,
): Promise<LoadState<MatchRecordSummary>> {
  try {
    const envelope = await getRecords({
      tournamentId: state.tournamentId,
      stageId: state.stageId,
      playerId: state.playerId || undefined,
      limit: 10,
      offset: 0,
    });

    return { envelope, source: 'api' };
  } catch (error) {
    return {
      ...createEmptyLoadState<MatchRecordSummary>(),
      warning:
        error instanceof Error
          ? error.message
          : 'Unable to load match records.',
    };
  }
}

function getRecords(filters: MatchRecordListQuery) {
  return sendAPI<ListEnvelope<TournamentMatchRecordView>>(
    new TournamentRecordListAPI(filters),
  ).then((envelope) => ({
    ...envelope,
    items: envelope.items.map(mapMatchRecordSummary),
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
