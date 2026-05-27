import { useParams } from 'react-router-dom';

import { PublicTournamentDetailSection } from './components/PublicTournamentDetailSection';
import {
  PublicTournamentDetailFrame,
  PublicTournamentDetailLoading,
  PublicTournamentDetailNotFound,
} from './components/PublicTournamentDetailFrame';
import { useTournamentDetail } from './hooks';

export function PublicTournamentDetailPage() {
  const { tournamentId } = useParams();
  const { state, isLoading, refresh } = useTournamentDetail(tournamentId);

  if (isLoading || !state) {
    return (
      <PublicTournamentDetailFrame>
        <PublicTournamentDetailLoading />
      </PublicTournamentDetailFrame>
    );
  }

  if (!state.item) {
    return (
      <PublicTournamentDetailFrame>
        <PublicTournamentDetailNotFound title="未找到赛事" />
      </PublicTournamentDetailFrame>
    );
  }

  return (
    <PublicTournamentDetailFrame>
      <PublicTournamentDetailSection
        key={tournamentId ?? 'missing-tournament'}
        state={state}
        onScheduleSuccess={refresh}
      />
    </PublicTournamentDetailFrame>
  );
}
