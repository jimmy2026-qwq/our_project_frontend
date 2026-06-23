import { APIMessage } from '@/system/api';
import type { ClubApplicationListQuery, ClubMembershipApplicationView, ListEnvelope } from '@/objects';

export class ListClubApplicationsAPI extends APIMessage<ListEnvelope<ClubMembershipApplicationView>> {
  readonly query: ClubApplicationListQuery;

  constructor(
    readonly clubId: string,
    filters: ClubApplicationListQuery,
  ) {
    super();
    this.query = filters;
  }
}
