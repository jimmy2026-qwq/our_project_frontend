import type { FinalStanding } from '../FinalStanding';
import type { PaifuRoundScoreChanges } from './PaifuRoundScoreChanges';

export interface PaifuSummary {
  paifuId: string;
  tableId: string;
  tournamentId: string;
  stageId: string;
  recordedAt: string;
  source: string;
  matchRecordId: string | null;
  totalHands: number;
  playerIds: string[];
  finalStandings: FinalStanding[];
  roundScoreChanges: PaifuRoundScoreChanges[];
}
