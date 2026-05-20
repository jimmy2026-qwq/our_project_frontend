import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { ClubMemberPrivilegeListQuery, ClubMemberPrivilegeSnapshot, ListEnvelope } from '@/objects';

export class ListClubMemberPrivilegesAPI extends APIMessage<ListEnvelope<ClubMemberPrivilegeSnapshot>> {
  readonly playerId: string[];
  readonly privilege: string[];
  readonly rankCode: string[];
  readonly limit: number[];
  readonly offset: number[];

  constructor(
    readonly clubId: string,
    filters: ClubMemberPrivilegeListQuery = {},
  ) {
    super();
    this.playerId = encodeBackendOption(filters.playerId);
    this.privilege = encodeBackendOption(filters.privilege);
    this.rankCode = encodeBackendOption(filters.rankCode);
    this.limit = encodeBackendOption(filters.limit);
    this.offset = encodeBackendOption(filters.offset);
  }
}
