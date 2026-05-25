import { APIMessage } from '@/system/api';
import type { CreatePlayerRequest, PlayerResponse } from '@/objects/player';

export class CreatePlayerAPI extends APIMessage<PlayerResponse> {
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
