import type { TournamentTableView } from '../../stage/table/apiTypes/TournamentTableView';
import type { TournamentDetailView } from './TournamentDetailView';

export interface TournamentMutationView {
  tournament: TournamentDetailView;
  scheduledTables: TournamentTableView[];
}
