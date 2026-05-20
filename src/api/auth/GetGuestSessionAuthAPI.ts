import { APIMessage } from '@/system/api';
import type { GuestSessionResponse } from '@/objects/auth';

export class GetGuestSessionAuthAPI extends APIMessage<GuestSessionResponse> {
  constructor(readonly sessionId: string) {
    super();
  }
}
