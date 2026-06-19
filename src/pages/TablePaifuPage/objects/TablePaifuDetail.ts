import type { FinalStanding, Paifu, PaifuRound } from '@/objects';

// Frontend-enriched paifu for this page. Core paifu fields still come from the
// backend Paifu object; these optional names are resolved for display only.
export type TablePaifuDetail = Paifu & {
  metadata: Paifu['metadata'] & {
    tournamentName?: string;
    stageName?: string;
    playerNames?: Record<string, string>;
  };
  rounds: PaifuRound[];
  finalStandings: FinalStanding[];
};
