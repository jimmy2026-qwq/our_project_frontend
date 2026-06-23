import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { GuestSessionResponse, ListEnvelope } from '@/objects';

export class ListGuestSessionsAuthAPI extends APIMessage<ListEnvelope<GuestSessionResponse>> {
  readonly activeOnly: boolean[];
  readonly limit: number[];
  readonly offset: number[];

  constructor(filters: { activeOnly?: boolean; limit?: number; offset?: number } = {}) {
    super();
    this.activeOnly = encodeBackendOption(filters.activeOnly);
    this.limit = encodeBackendOption(filters.limit);
    this.offset = encodeBackendOption(filters.offset);
  }
}
