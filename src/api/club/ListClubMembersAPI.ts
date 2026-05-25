import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { PlayerProfileView, ClubMemberListQuery, ListEnvelope } from '@/objects';
import type { PlayerStatus } from '@/objects/tournament';
import type { BackendOption } from '@/system/api/backend-option.transport';

export class ListClubMembersAPI extends APIMessage<ListEnvelope<PlayerProfileView>> {
  readonly status: BackendOption<PlayerStatus>;
  readonly nickname: string[];
  readonly limit: number[];
  readonly offset: number[];

  constructor(
    readonly clubId: string,
    filters: ClubMemberListQuery = {},
  ) {
    super();
    this.status = encodeBackendOption(filters.status);
    this.nickname = encodeBackendOption(filters.nickname);
    this.limit = encodeBackendOption(filters.limit);
    this.offset = encodeBackendOption(filters.offset);
  }
}
