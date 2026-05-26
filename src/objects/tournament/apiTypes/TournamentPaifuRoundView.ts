import type { TournamentPaifuActionView } from './TournamentPaifuActionView';
import type { TournamentPaifuRoundDescriptorView } from './TournamentPaifuRoundDescriptorView';
import type { TournamentPaifuRoundResultView } from './TournamentPaifuRoundResultView';

export interface TournamentPaifuRoundView {
  descriptor: TournamentPaifuRoundDescriptorView;
  initialHands: Record<string, string[]>;
  actions: TournamentPaifuActionView[];
  result: TournamentPaifuRoundResultView;
}
