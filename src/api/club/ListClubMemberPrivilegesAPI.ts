import { APIMessage } from '@/system/api';
import { encodeBackendOption } from '@/system/api/backend-option.transport';
import type { ClubMemberPrivilegeListQuery, ClubMemberPrivilegeSnapshotView, ListEnvelope } from '@/objects';

interface ClubMemberPrivilegeListQueryTransport {
  playerId: [] | [string];
  privilege: [] | [string];
  rankCode: [] | [string];
  limit: [] | [number];
  offset: [] | [number];
}

export class ListClubMemberPrivilegesAPI extends APIMessage<ListEnvelope<ClubMemberPrivilegeSnapshotView>> {
  readonly query: ClubMemberPrivilegeListQueryTransport;

  constructor(
    readonly clubId: string,
    filters: ClubMemberPrivilegeListQuery = {},
  ) {
    super();
    this.query = {
      playerId: encodeBackendOption(filters.playerId),
      privilege: encodeBackendOption(filters.privilege),
      rankCode: encodeBackendOption(filters.rankCode),
      limit: encodeBackendOption(filters.limit),
      offset: encodeBackendOption(filters.offset),
    };
  }
}
