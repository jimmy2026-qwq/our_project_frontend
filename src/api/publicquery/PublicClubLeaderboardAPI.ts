import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { ClubLeaderboardEntry, ListEnvelope, PublicClubLeaderboardQuery } from '@/objects';

export class PublicClubLeaderboardAPI extends APIMessage<ListEnvelope<ClubLeaderboardEntry>> {
  readonly name: string[];
  readonly limit: number[];
  readonly offset: number[];

  constructor(filters: PublicClubLeaderboardQuery = {}) {
    super();
    this.name = encodeBackendOption(filters.name);
    this.limit = encodeBackendOption(filters.limit);
    this.offset = encodeBackendOption(filters.offset);
  }
}
