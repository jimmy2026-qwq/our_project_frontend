import type { FinalStanding } from './FinalStanding';
import type { PaifuMetadata } from './PaifuMetadata';
import type { PaifuRound } from './PaifuRound';

export interface Paifu {
  id: string;
  metadata: PaifuMetadata;
  rounds: PaifuRound[];
  finalStandings: FinalStanding[];
}
