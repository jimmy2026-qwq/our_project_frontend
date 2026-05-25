import { APIMessage } from '@/system/api';
import type { Club, ClubListQuery, ListEnvelope } from '@/objects';

export class ListClubsAPI extends APIMessage<ListEnvelope<Club>> {
  readonly query: ClubListQuery;

  constructor(filters: ClubListQuery = {}) {
    super();
    this.query = filters;
  }
}
