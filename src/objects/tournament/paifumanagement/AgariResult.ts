import type { HandOutcome } from './HandOutcome';
import type { PaifuTile } from './PaifuTile';
import type { RoundSettlement } from './RoundSettlement';
import type { ScoreChange } from './ScoreChange';
import type { Yaku } from './Yaku';

export interface AgariWinResult {
  winner: string;
  target: string | null;
  han: number | null;
  fu: number | null;
  yaku: Yaku[];
  doraIndicators: PaifuTile[] | null;
  uraDoraIndicators: PaifuTile[] | null;
  uraDoraVisible: boolean | null;
  points: number;
}

export interface AgariResult {
  outcome: HandOutcome | string;
  winner: string | null;
  target: string | null;
  han: number | null;
  fu: number | null;
  yaku: Yaku[];
  doraIndicators: PaifuTile[] | null;
  uraDoraIndicators: PaifuTile[] | null;
  uraDoraVisible: boolean | null;
  points: number;
  scoreChanges: ScoreChange[];
  settlement: RoundSettlement | null;
  tenpaiPlayerIds: string[] | null;
  wins?: AgariWinResult[];
}
