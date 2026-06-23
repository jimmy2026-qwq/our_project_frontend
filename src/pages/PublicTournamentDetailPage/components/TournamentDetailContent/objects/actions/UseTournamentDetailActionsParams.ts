import type { TournamentDetailActionEnvironment } from './TournamentDetailActionEnvironment';
import type { TournamentDetailActionSetters } from './TournamentDetailActionSetters';
import type { TournamentDetailActionState } from './TournamentDetailActionState';

export type UseTournamentDetailActionsParams =
  TournamentDetailActionEnvironment &
    TournamentDetailActionState &
    TournamentDetailActionSetters;
