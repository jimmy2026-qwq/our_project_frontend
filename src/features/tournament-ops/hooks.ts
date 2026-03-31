import { useEffect, useState } from 'react';

import {
  DEFAULT_TOURNAMENT_OPS_STATE,
  loadAppeals,
  loadRecords,
  loadTables,
  type LoadState,
  type TournamentOpsState,
} from './data';
import type { AppealSummary, MatchRecordSummary, TournamentTableSummary } from '@/domain/models';

export function useTournamentOpsState() {
  const [state, setState] = useState<TournamentOpsState>(DEFAULT_TOURNAMENT_OPS_STATE);
  return { state, setState };
}

export function useTournamentOpsData(state: TournamentOpsState, reloadKey = 0) {
  const [tables, setTables] = useState<LoadState<TournamentTableSummary> | null>(null);
  const [records, setRecords] = useState<LoadState<MatchRecordSummary> | null>(null);
  const [appeals, setAppeals] = useState<LoadState<AppealSummary> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setIsLoading(true);
      const [nextTables, nextRecords, nextAppeals] = await Promise.all([
        loadTables(state),
        loadRecords(state),
        loadAppeals(state),
      ]);

      if (!cancelled) {
        setTables(nextTables);
        setRecords(nextRecords);
        setAppeals(nextAppeals);
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reloadKey, state]);

  return { tables, records, appeals, isLoading };
}
