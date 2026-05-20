import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { CreatePlayerRequest, PlayerResponse } from '@/objects/player';

export class CreatePlayerAPI extends APIMessage<PlayerResponse> {
  readonly userId: string;
  readonly nickname: string;
  readonly rankPlatform: string;
  readonly tier: string;
  readonly stars: number[];
  readonly initialElo: number;

  constructor(payload: CreatePlayerRequest) {
    super();
    this.userId = payload.userId;
    this.nickname = payload.nickname;
    this.rankPlatform = payload.rankPlatform;
    this.tier = payload.tier;
    this.stars = encodeBackendOption(payload.stars);
    this.initialElo = payload.initialElo ?? 1500;
  }

  static fromRequest(payload: CreatePlayerRequest) {
    return new CreatePlayerAPI(payload);
  }
}
