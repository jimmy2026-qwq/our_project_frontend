import type { AgariResult, KyokuDescriptor, PaifuTile } from '../../paifumanagement';
import type { MahjongPendingCallView } from './MahjongPendingCallView';
import type { MahjongRoundPhase } from './MahjongRoundPhase';
import type { MahjongTableSticks } from './MahjongTableSticks';

export interface MahjongRoundView {
  descriptor: KyokuDescriptor;
  phase: MahjongRoundPhase;
  turnPlayerId: string | null;
  wallTileCount: number;
  sticks: MahjongTableSticks;
  doraIndicators: PaifuTile[];
  doraIndicatorVisibleCount: number;
  pendingCall: MahjongPendingCallView | null;
  result: AgariResult | null;
}
