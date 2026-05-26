import { APIMessage } from '@/system/api';
import type { CreatePlayerRequest, PlayerProfileView } from '@/objects/player';

export class CreatePlayerAPI extends APIMessage<PlayerProfileView> {
  readonly request: CreatePlayerRequest;

  constructor(payload: CreatePlayerRequest) {
    super();
    this.request = {
      ...payload,
      initialElo: payload.initialElo ?? 1500,
    };
  }

  static fromRequest(payload: CreatePlayerRequest) {
    return new CreatePlayerAPI(payload);
  }
}
