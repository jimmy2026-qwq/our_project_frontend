import { emptyBackendOption, encodeBackendOption } from './backend-option.transport';
import type { CreateGuestSessionPayload, CreatePlayerPayload } from './auth.shared';

export function buildCreateGuestSessionRequest(payload: CreateGuestSessionPayload) {
  return {
    displayName: encodeBackendOption(payload.displayName),
    ttlHours: emptyBackendOption<number>(),
    deviceFingerprint: emptyBackendOption<string>(),
  };
}

export function buildRevokeGuestSessionRequest(reason?: string) {
  return {
    reason: encodeBackendOption(reason),
  };
}

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
