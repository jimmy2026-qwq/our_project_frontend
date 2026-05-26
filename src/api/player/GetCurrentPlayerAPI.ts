import { APIMessage } from '@/system/api';
import type { PlayerProfileView } from '@/objects/player';

export class GetCurrentPlayerAPI extends APIMessage<PlayerProfileView> {
  constructor(readonly operatorId: string) {
    super();
  }
}
