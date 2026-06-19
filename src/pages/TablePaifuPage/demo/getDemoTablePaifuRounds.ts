import type { PaifuRound as PaifuRoundSummary } from '@/objects';
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
