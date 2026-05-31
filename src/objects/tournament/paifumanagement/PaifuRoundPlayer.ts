import type { SeatWind } from '../tablemanagement/SeatWind';
import type { PaifuHand } from './PaifuHand';
import type { PaifuPlayerTrack } from './PaifuPlayerTrack';

export interface PaifuRoundPlayer {
  playerId: string;
  seat: SeatWind;
  initialHand: PaifuHand;
  track: PaifuPlayerTrack;
}
