import type { PaifuRoundSummary } from '../types';
import { getDemoAbortiveDrawRound } from './getDemoAbortiveDrawRound';
import { getDemoExhaustiveDrawRound } from './getDemoExhaustiveDrawRound';
import { getDemoRonRound } from './getDemoRonRound';

export function getDemoTablePaifuRounds(): PaifuRoundSummary[] {
  return [
    getDemoAbortiveDrawRound(),
    getDemoExhaustiveDrawRound(),
    getDemoRonRound(),
  ];
}
