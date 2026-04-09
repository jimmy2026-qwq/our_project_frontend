import { useEffect, useState } from 'react';

import {
  loadAppeals,
  loadRecords,
  loadTables,
  normalizeTournamentOpsState,
  type LoadState,
  type TournamentContext,
  type TournamentOpsState,
} from './data';
import type { AppealSummary, MatchRecordSummary, TournamentTableSummary } from '@/domain/operations';

export function useTournamentOpsPanelData(
  tournaments: TournamentContext[],
  state: TournamentOpsState,
  reloadKey = 0,
) {
  const [tables, setTables] = useState<LoadState<TournamentTableSummary> | null>(null);
  const [records, setRecords] = useState<LoadState<MatchRecordSummary> | null>(null);
  const [appeals, setAppeals] = useState<LoadState<AppealSummary> | null>(null);
  const [isLoadingPanelData, setIsLoadingPanelData] = useState(true);

  useEffect(() => {
    if (tournaments.length === 0) {
      setTables(null);
      setRecords(null);
      setAppeals(null);
      setIsLoadingPanelData(false);
      return;
    }

    let cancelled = false;

    void (async () => {
      setIsLoadingPanelData(true);
      const effectiveState = normalizeTournamentOpsState(tournaments, state);
      const [nextTables, nextRecords, nextAppeals] = await Promise.all([
        loadTables(effectiveState),
        loadRecords(effectiveState),
        loadAppeals(effectiveState),
      ]);

      if (!cancelled) {
        setTables(nextTables);
        setRecords(nextRecords);
        setAppeals(nextAppeals);
        setIsLoadingPanelData(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reloadKey, state, tournaments]);

  return { tables, records, appeals, isLoadingPanelData };
}
