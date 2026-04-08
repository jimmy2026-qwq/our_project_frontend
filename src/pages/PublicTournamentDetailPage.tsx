import { useParams } from 'react-router-dom';
import { useReducer } from 'react';

import {
  PublicDetailNotFound,
  PublicHallLoading,
  PublicTournamentDetailSection,
} from '@/features/public-hall/components';
import { buildFallbackTournamentStages } from '@/features/public-hall/data';
import { useTournamentDetail } from '@/features/public-hall/hooks';

export function PublicTournamentDetailPage() {
  const { tournamentId } = useParams();
  const { state, isLoading, refresh } = useTournamentDetail(tournamentId);
  const [, reloadOpsWorkbench] = useReducer((value) => value + 1, 0);

  if (isLoading || !state) {
    return <PublicHallLoading />;
  }

  if (!state.item) {
    return <PublicDetailNotFound title="Tournament not found" />;
  }

  return (
    <>
      <PublicTournamentDetailSection
        state={state}
        stages={buildFallbackTournamentStages(tournamentId ?? state.item.id, state.item)}
        onScheduleSuccess={() => {
          refresh();
          reloadOpsWorkbench();
        }}
      />
    </>
  );
}
