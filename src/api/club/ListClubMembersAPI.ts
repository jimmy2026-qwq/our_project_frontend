import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { PlayerProfileView, ClubMemberListQuery, ListEnvelope } from '@/objects';

export class ListClubMembersAPI extends APIMessage<ListEnvelope<PlayerProfileView>> {
  readonly status: string[];
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
