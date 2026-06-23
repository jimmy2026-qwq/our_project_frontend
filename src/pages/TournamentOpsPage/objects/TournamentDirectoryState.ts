import type { TournamentContext } from './TournamentContext';

export interface TournamentDirectoryState {
  items: TournamentContext[];
  warning?: string;
}
