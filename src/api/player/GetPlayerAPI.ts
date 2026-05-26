import { APIMessage } from '@/system/api';
import type { PlayerProfileView } from '@/objects/player';

export class GetPlayerAPI extends APIMessage<PlayerProfileView> {
  constructor(readonly playerId: string) {
    super();
  }
}
