import type { AgariResult } from './AgariResult';
import type { KyokuDescriptor } from './KyokuDescriptor';
import type { PaifuRoundPlayer } from './PaifuRoundPlayer';
import type { PaifuTimeline } from './PaifuTimeline';

export interface PaifuRound {
  descriptor: KyokuDescriptor;
  players: PaifuRoundPlayer[];
  timeline: PaifuTimeline;
  result: AgariResult;
}
