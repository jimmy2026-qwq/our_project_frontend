import type { PlayerProfileView } from '@/objects/player';
import { APIMessage } from '@/system/api';

export class GetCurrentPlayerAPI extends APIMessage<PlayerProfileView> {
  constructor(readonly operatorId: string) {
    super();
  }
}
