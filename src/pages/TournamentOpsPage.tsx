import { useEffect, useReducer, useState } from 'react';

import { TournamentOpsLoading, TournamentOpsPageSection } from '@/features/tournament-ops/components';
import { useTournamentOpsData, useTournamentOpsState } from '@/features/tournament-ops/hooks';
import { useRefreshNotice } from '@/hooks';

export function TournamentOpsPage() {
  const { state, setState } = useTournamentOpsState();
  const [reloadKey, forceReload] = useReducer((value) => value + 1, 0);
  const [pendingRefresh, setPendingRefresh] = useState(false);
  const { tables, records, appeals, isLoading } = useTournamentOpsData(state, reloadKey);
  const { notifyRefreshResult } = useRefreshNotice();

  useEffect(() => {
    if (!pendingRefresh || isLoading || !tables || !records || !appeals) {
      return;
    }

    notifyRefreshResult(
      [tables, records, appeals],
      {
        failureTitle: 'Tournament ops refresh failed',
        successTitle: 'Tournament ops refreshed',
        successMessage: 'Live operations data was reloaded successfully.',
        fallbackTitle: 'Tournament ops refreshed with fallback',
        fallbackMessage: 'Some operations panels are currently using mock data.',
      },
    );

    setPendingRefresh(false);
  }, [appeals, isLoading, notifyRefreshResult, pendingRefresh, records, tables]);

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
