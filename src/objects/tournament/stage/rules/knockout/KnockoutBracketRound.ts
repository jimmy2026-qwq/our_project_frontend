import type { KnockoutBracketMatch } from './KnockoutBracketMatch';

export interface KnockoutBracketRound {
  roundNumber: number;
  label: string;
  matches: KnockoutBracketMatch[];
}
