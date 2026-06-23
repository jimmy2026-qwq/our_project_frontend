import type { TournamentTableView } from '../stage/table/TournamentTableView';
import type { TournamentDetailView } from './TournamentDetailView';

export interface TournamentMutationView {
  tournament: TournamentDetailView;
  scheduledTables: TournamentTableView[];
}
