import { APIMessage } from '@/system/api';
import type { ClubView, ClubListQuery, ListEnvelope } from '@/objects';

export class ListClubsAPI extends APIMessage<ListEnvelope<ClubView>> {
  readonly query: ClubListQuery;

  constructor(filters: ClubListQuery = {}) {
    super();
    this.query = filters;
  }
}
