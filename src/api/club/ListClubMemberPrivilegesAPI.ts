import { APIMessage } from '@/system/api';
import type { ClubMemberPrivilegeListQuery, ClubMemberPrivilegeSnapshot, ListEnvelope } from '@/objects';

export class ListClubMemberPrivilegesAPI extends APIMessage<ListEnvelope<ClubMemberPrivilegeSnapshot>> {
  readonly query: ClubMemberPrivilegeListQuery;

  constructor(
    readonly clubId: string,
    filters: ClubMemberPrivilegeListQuery = {},
  ) {
    super();
    this.query = filters;
  }
}
