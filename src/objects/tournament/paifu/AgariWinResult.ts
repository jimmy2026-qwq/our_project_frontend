import type { PaifuTile } from './PaifuTile';
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
