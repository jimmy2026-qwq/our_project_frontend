import { useParams } from 'react-router-dom';

import {
  PublicDetailNotFound,
  PublicHallLoading,
  PublicTournamentDetailSection,
} from '@/features/public-hall/components';
import { buildFallbackTournamentStages } from '@/features/public-hall/data';
import { useTournamentDetail } from '@/features/public-hall/hooks';
import { useAuth } from '@/hooks';
import { TournamentOpsWorkbench } from '@/pages/TournamentOpsPage';

export function PublicTournamentDetailPage() {
  const { tournamentId } = useParams();
  const { state, isLoading } = useTournamentDetail(tournamentId);
  const { session } = useAuth();
  const canOperateTournament =
    !!session?.user.roles.isRegisteredPlayer &&
    (session.user.roles.isSuperAdmin || session.user.roles.isTournamentAdmin);

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
      />
      {canOperateTournament ? (
        <TournamentOpsWorkbench fixedTournamentId={state.item.id} hideTournamentSelect />
      ) : null}
    </>
  );
}
