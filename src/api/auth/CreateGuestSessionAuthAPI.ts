import { emptyBackendOption, encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { CreateGuestSessionRequest, GuestSessionResponse } from '@/objects/auth';

export class CreateGuestSessionAuthAPI extends APIMessage<GuestSessionResponse> {
  readonly displayName: string[];
  readonly ttlHours: number[];
  readonly deviceFingerprint: string[];

  constructor(payload: CreateGuestSessionRequest) {
    super();
    this.displayName = encodeBackendOption(payload.displayName);
    this.ttlHours = emptyBackendOption<number>();
    this.deviceFingerprint = emptyBackendOption<string>();
  }
}
