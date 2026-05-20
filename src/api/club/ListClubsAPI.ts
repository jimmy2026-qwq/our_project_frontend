import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { Club, ClubListQuery, ListEnvelope } from '@/objects';

export class ListClubsAPI extends APIMessage<ListEnvelope<Club>> {
  readonly activeOnly: boolean[];
  readonly joinableOnly: boolean[];
  readonly memberId: string[];
  readonly adminId: string[];
  readonly name: string[];
  readonly limit: number[];
  readonly offset: number[];

  constructor(filters: ClubListQuery = {}) {
    super();
    this.activeOnly = encodeBackendOption(filters.activeOnly);
    this.joinableOnly = encodeBackendOption(filters.joinableOnly);
    this.memberId = encodeBackendOption(filters.memberId);
    this.adminId = encodeBackendOption(filters.adminId);
    this.name = encodeBackendOption(filters.name);
    this.limit = encodeBackendOption(filters.limit);
    this.offset = encodeBackendOption(filters.offset);
  }
}
