import { useReducer } from 'react';

import { TournamentOpsLoading, TournamentOpsPageSection } from '@/features/tournament-ops/components';
import { useTournamentOpsData, useTournamentOpsState } from '@/features/tournament-ops/hooks';

export function TournamentOpsPage() {
  const { state, setState } = useTournamentOpsState();
  const [reloadKey, forceReload] = useReducer((value) => value + 1, 0);
  const { tables, records, appeals, isLoading } = useTournamentOpsData(state, reloadKey);

  if (isLoading || !tables || !records || !appeals) {
    return <TournamentOpsLoading />;
  }

  return (
    <TournamentOpsPageSection
      state={state}
      tables={tables}
      records={records}
      appeals={appeals}
      onReload={forceReload}
      onStateChange={(patch) => setState((current) => ({ ...current, ...patch }))}
    />
  );
}
