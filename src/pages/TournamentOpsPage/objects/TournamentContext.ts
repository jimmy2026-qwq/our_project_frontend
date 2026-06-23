import type { StageContext } from './StageContext';

export interface TournamentContext {
  id: string;
  name: string;
  stages: StageContext[];
}
