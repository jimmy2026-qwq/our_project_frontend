import { APIMessage } from '@/system/api';
import type { PlayerResponse } from '@/objects/player';

export class GetPlayerAPI extends APIMessage<PlayerResponse> {
  constructor(readonly playerId: string) {
    super();
  }
}
