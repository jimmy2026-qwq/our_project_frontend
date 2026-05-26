import type { TournamentPaifuFinalStandingView } from './TournamentPaifuFinalStandingView';
import type { TournamentPaifuMetadataView } from './TournamentPaifuMetadataView';
import type { TournamentPaifuRoundView } from './TournamentPaifuRoundView';

export interface TournamentPaifuSummaryView {
  paifuId: string;
  tableId: string;
  tournamentId: string;
  stageId: string;
  recordedAt: string;
  source: string;
  matchRecordId: string | null;
  totalHands: number;
  playerIds: string[];
  finalStandings: TournamentPaifuFinalStandingView[];
  metadata: TournamentPaifuMetadataView;
  rounds: TournamentPaifuRoundView[];
}
