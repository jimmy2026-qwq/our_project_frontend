import { APIMessage } from '@/system/api';
import type { GuestSessionResponse } from '@/objects/auth';

export class UpgradeGuestSessionAuthAPI extends APIMessage<GuestSessionResponse> {
  constructor(
    readonly sessionId: string,
    readonly playerId: string,
  ) {
    super();
  }
}
