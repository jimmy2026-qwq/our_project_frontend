import { emptyBackendOption, encodeBackendOption } from '../shared/backend-option.transport';
import type { CreateGuestSessionPayload } from '@/objects/auth';

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
