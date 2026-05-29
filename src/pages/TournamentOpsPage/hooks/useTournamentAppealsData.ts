import { useEffect, useState } from 'react';

import { AppealListAPI } from '@/api/tournament/appeal/AppealListAPI';
import type { AppealListQuery } from '@/objects';
import type { AppealSummary } from '@/pages/objects/TournamentViews';
import { sendAPI } from '@/system/api';

import type { LoadState, TournamentOpsState } from '../objects/data';
import { toAppealSummary } from '../objects/TournamentOps.mappers';

export function useTournamentAppealsData(
  state: TournamentOpsState,
  reloadKey: number,
  enabled: boolean,
) {
  const [appeals, setAppeals] = useState<LoadState<AppealSummary> | null>(null);
  const [isLoadingAppeals, setIsLoadingAppeals] = useState(true);

  useEffect(() => {
    if (!enabled) {
      setAppeals(null);
      setIsLoadingAppeals(false);
      return;
    }

    let cancelled = false;

    async function loadData() {
      setIsLoadingAppeals(true);
      const nextAppeals = await loadAppeals(state);

      if (!cancelled) {
        setAppeals(nextAppeals);
        setIsLoadingAppeals(false);
      }
    }

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [enabled, reloadKey, state]);

  return { appeals, isLoadingAppeals };
}

async function loadAppeals(
  state: TournamentOpsState,
): Promise<LoadState<AppealSummary>> {
  try {
    const envelope = await getAppeals({
      tournamentId: state.tournamentId,
      status: state.appealStatus || undefined,
      limit: 10,
      offset: 0,
    });

    return { envelope, source: 'api' };
  } catch (error) {
    return {
      ...createEmptyLoadState<AppealSummary>(),
      warning:
        error instanceof Error ? error.message : 'Unable to load appeals.',
    };
  }
}

function getAppeals(filters: AppealListQuery) {
  return sendAPI(new AppealListAPI(filters)).then((envelope) => ({
    ...envelope,
    items: envelope.items.map(toAppealSummary),
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
