import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { ListEnvelope } from '@/objects';
import type { PlayerListQuery, PlayerProfileView } from '@/objects/player';
import type { BackendOption } from '@/system/api/backend-option.transport';
import type { PlayerStatus } from '@/objects/tournament';

export class ListPlayersAPI extends APIMessage<ListEnvelope<PlayerProfileView>> {
  readonly clubId: string[];
  readonly status: BackendOption<PlayerStatus>;
  readonly nickname: string[];
  readonly limit: number[];
  readonly offset: number[];

  constructor(payload: PlayerListQuery = {}) {
    super();
    this.clubId = encodeBackendOption(payload.clubId);
    this.status = encodeBackendOption(payload.status);
    this.nickname = encodeBackendOption(payload.nickname);
    this.limit = encodeBackendOption(payload.limit);
    this.offset = encodeBackendOption(payload.offset);
  }
}
