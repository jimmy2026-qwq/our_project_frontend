import type { TournamentPaifuHandOutcome } from './TournamentPaifuHandOutcome';
import type { TournamentPaifuRoundSettlementView } from './TournamentPaifuRoundSettlementView';
import type { TournamentPaifuScoreChangeView } from './TournamentPaifuScoreChangeView';
import type { TournamentPaifuYakuView } from './TournamentPaifuYakuView';

export interface TournamentPaifuRoundResultView {
  outcome: TournamentPaifuHandOutcome | string;
  winner: string | null;
  target: string | null;
  han: number | null;
  fu: number | null;
  yaku: TournamentPaifuYakuView[];
  doraIndicators: string[] | null;
  uraDoraIndicators: string[] | null;
  uraDoraVisible: boolean | null;
  points: number;
  scoreChanges: TournamentPaifuScoreChangeView[];
  settlement: TournamentPaifuRoundSettlementView | null;
  tenpaiPlayerIds: string[] | null;
}
