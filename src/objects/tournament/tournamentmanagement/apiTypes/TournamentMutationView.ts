import type { TournamentTableView } from '../../tablemanagement/apiTypes/TournamentTableView';
import type { TournamentDetailView } from './TournamentDetailView';

export interface TournamentMutationView {
  tournament: TournamentDetailView;
  scheduledTables: TournamentTableView[];
}
