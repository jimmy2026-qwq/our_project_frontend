import { encodeBackendOption } from '../shared/backend-option.transport';
import type { CreatePlayerPayload } from './requests/players.requests';

export function buildCreatePlayerRequest(payload: CreatePlayerPayload) {
  return {
    userId: payload.userId,
    nickname: payload.nickname,
    rankPlatform: payload.rankPlatform,
    tier: payload.tier,
    stars: encodeBackendOption(payload.stars),
    initialElo: payload.initialElo ?? 1500,
  };
}
