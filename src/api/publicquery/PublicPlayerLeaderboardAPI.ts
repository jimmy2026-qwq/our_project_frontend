import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { ListEnvelope, PlayerLeaderboardEntry, PlayerLeaderboardQuery } from '@/objects';

export class PublicPlayerLeaderboardAPI extends APIMessage<ListEnvelope<PlayerLeaderboardEntry>> {
  readonly clubId: string[];
  readonly status: string[];
  readonly limit: number[];
  readonly offset: number[];

  constructor(filters: PlayerLeaderboardQuery = {}) {
    super();
    this.clubId = encodeBackendOption(filters.clubId);
    this.status = encodeBackendOption(filters.status);
    this.limit = encodeBackendOption(filters.limit);
    this.offset = encodeBackendOption(filters.offset);
  }
}
