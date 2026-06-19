import type { KnockoutBracketRound } from './KnockoutBracketRound';

export interface KnockoutBracketSnapshot {
  tournamentId: string;
  stageId: string;
  generatedAt: string;
  bracketSize: number;
  qualifiedPlayerIds: string[];
  rounds: KnockoutBracketRound[];
  summary: string;
}
