import { useEffect, useReducer, useState } from 'react';

import { TournamentOpsLoading, TournamentOpsPageSection } from '@/features/tournament-ops/components';
import { useTournamentOpsData, useTournamentOpsState } from '@/features/tournament-ops/hooks';
import { useNotice } from '@/hooks';

export function TournamentOpsPage() {
  const { state, setState } = useTournamentOpsState();
  const [reloadKey, forceReload] = useReducer((value) => value + 1, 0);
  const [pendingRefresh, setPendingRefresh] = useState(false);
  const { tables, records, appeals, isLoading } = useTournamentOpsData(state, reloadKey);
  const { notifySuccess, notifyWarning } = useNotice();

  useEffect(() => {
    if (!pendingRefresh || isLoading || !tables || !records || !appeals) {
      return;
    }

    const warnings = [tables.warning, records.warning, appeals.warning].filter(Boolean);
    const hasFallback = [tables, records, appeals].some((payload) => payload.source === 'mock');

    if (hasFallback) {
      notifyWarning('Tournament ops refreshed with fallback', warnings[0] ?? 'Some operations panels are currently using mock data.');
    } else {
      notifySuccess('Tournament ops refreshed', 'Live operations data was reloaded successfully.');
    }

    setPendingRefresh(false);
  }, [appeals, isLoading, notifySuccess, notifyWarning, pendingRefresh, records, tables]);

  const handleRefresh = () => {
    setPendingRefresh(true);
    forceReload();
  };

  if (isLoading || !tables || !records || !appeals) {
    return <TournamentOpsLoading />;
  }

  return (
    <TournamentOpsPageSection
      state={state}
      tables={tables}
      records={records}
      appeals={appeals}
      onReload={handleRefresh}
      onStateChange={(patch) => setState((current) => ({ ...current, ...patch }))}
    />
  );
}
