import type { PaifuTile } from '../../paifumanagement';
import type { SeatWind } from '../../tablemanagement';
import type { MahjongDiscard } from './MahjongDiscard';
import type { MahjongMeld } from './MahjongMeld';

export interface MahjongSeatView {
  seat: SeatWind;
  playerId: string;
  points: number;
  isDealer: boolean;
  handTiles: PaifuTile[] | null;
  handTileCount: number;
  melds: MahjongMeld[];
  river: MahjongDiscard[];
  riichi: boolean;
  ippatsu: boolean;
  furiten: boolean;
  tenpai: boolean | null;
}
