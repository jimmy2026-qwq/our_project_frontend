import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { GuestSessionResponse } from '@/objects/auth';

export class RevokeGuestSessionAuthAPI extends APIMessage<GuestSessionResponse> {
  readonly reason: string[];

  constructor(
    readonly sessionId: string,
    reason?: string,
  ) {
    super();
    this.reason = encodeBackendOption(reason);
  }
}
