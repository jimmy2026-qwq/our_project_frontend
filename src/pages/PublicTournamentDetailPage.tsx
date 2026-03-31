import { useParams } from 'react-router-dom';

import {
  PublicDetailNotFound,
  PublicHallLoading,
  PublicTournamentDetailSection,
} from '@/features/public-hall/components';
import { buildFallbackTournamentStages } from '@/features/public-hall/data';
import { useTournamentDetail } from '@/features/public-hall/hooks';

export function PublicTournamentDetailPage() {
  const { tournamentId } = useParams();
  const { state, isLoading } = useTournamentDetail(tournamentId);

  if (isLoading || !state) {
    return <PublicHallLoading />;
  }

  if (!state.item) {
    return <PublicDetailNotFound title="Tournament not found" />;
  }

  return (
    <PublicTournamentDetailSection
      state={state}
      stages={buildFallbackTournamentStages(tournamentId ?? state.item.id, state.item)}
    />
  );
}
