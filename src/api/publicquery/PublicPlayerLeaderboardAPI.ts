import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { ListEnvelope, PlayerLeaderboardEntry, PlayerLeaderboardQuery } from '@/objects';
import type { PlayerStatus } from '@/objects/tournament';
import type { BackendOption } from '@/system/api/backend-option.transport';

export class PublicPlayerLeaderboardAPI extends APIMessage<ListEnvelope<PlayerLeaderboardEntry>> {
  readonly clubId: string[];
  readonly status: BackendOption<PlayerStatus>;
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
