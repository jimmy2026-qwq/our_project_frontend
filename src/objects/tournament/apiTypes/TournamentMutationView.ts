import type { TournamentTableView } from './TournamentTableView';
import type { TournamentDetailView } from './TournamentDetailView';

export interface TournamentMutationView {
  tournament: TournamentDetailView;
  scheduledTables: TournamentTableView[];
}
