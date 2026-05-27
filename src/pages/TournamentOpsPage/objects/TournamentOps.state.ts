import type { TournamentContext, TournamentOpsState } from './TournamentOps.types';

export function getActiveTournament(
  tournaments: TournamentContext[],
  tournamentId: string,
) {
  return (
    tournaments.find((tournament) => tournament.id === tournamentId) ??
    tournaments[0] ??
    null
  );
}

export function normalizeTournamentOpsState(
  tournaments: TournamentContext[],
  state: TournamentOpsState,
): TournamentOpsState {
  if (tournaments.length === 0) {
    return {
      ...state,
      tournamentId: '',
      stageId: '',
    };
  }

  const activeTournament = getActiveTournament(tournaments, state.tournamentId);
  if (!activeTournament) {
    return state;
  }

  const hasTournament = tournaments.some(
    (tournament) => tournament.id === state.tournamentId,
  );
  const hasStage = activeTournament.stages.some(
    (stage) => stage.id === state.stageId,
  );

  return {
    ...state,
    tournamentId: hasTournament ? state.tournamentId : activeTournament.id,
    stageId: hasStage ? state.stageId : (activeTournament.stages[0]?.id ?? ''),
  };
}
