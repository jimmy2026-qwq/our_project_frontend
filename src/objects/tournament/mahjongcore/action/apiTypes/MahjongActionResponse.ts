import type { PaifuId } from '../../../paifumanagement';
import type { MahjongTableView } from '../../gamestate';
import type { MahjongPublicEventView } from '../MahjongPublicEventView';

export interface MahjongActionResponse {
  table: MahjongTableView;
  acceptedEvent: MahjongPublicEventView | null;
  archivedPaifuId: PaifuId | null;
}
