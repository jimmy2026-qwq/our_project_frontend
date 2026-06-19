import type { KnockoutBracketResult } from './KnockoutBracketResult';
import type { KnockoutBracketSlot } from './KnockoutBracketSlot';
import type { KnockoutLane } from './KnockoutLane';

export interface KnockoutBracketMatch {
  id: string;
  roundNumber: number;
  position: number;
  lane: KnockoutLane;
  slots: KnockoutBracketSlot[];
  sourceMatchIds: string[];
  advancementCount: number;
  nextMatchId: string | null;
  tableId: string | null;
  unlocked: boolean;
  completed: boolean;
  results: KnockoutBracketResult[];
}
