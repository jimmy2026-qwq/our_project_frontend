import { APIMessage } from '@/system/api';
import type { PlayerResponse } from '@/objects/player';

export class GetCurrentPlayerAPI extends APIMessage<PlayerResponse> {
  constructor(readonly operatorId: string) {
    super();
  }
}
