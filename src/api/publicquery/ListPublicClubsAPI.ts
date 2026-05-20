import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { ListEnvelope, PublicClubDirectoryEntry, PublicClubQuery } from '@/objects';

export class ListPublicClubsAPI extends APIMessage<ListEnvelope<PublicClubDirectoryEntry>> {
  readonly name: string[];
  readonly relation: string[];
  readonly limit: number[];
  readonly offset: number[];

  constructor(filters: PublicClubQuery = {}) {
    super();
    this.name = encodeBackendOption(filters.name);
    this.relation = encodeBackendOption(filters.relation);
    this.limit = encodeBackendOption(filters.limit);
    this.offset = encodeBackendOption(filters.offset);
  }
}
