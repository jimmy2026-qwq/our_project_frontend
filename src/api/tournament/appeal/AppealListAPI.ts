import { APIMessage } from '@/system/api';
import type { AppealListQuery, AppealTicketView, ListEnvelope } from '@/objects';

export class AppealListAPI extends APIMessage<ListEnvelope<AppealTicketView>> {
  readonly query: AppealListQuery;

  constructor(filters: AppealListQuery = {}) {
    super();
    this.query = filters;
  }
}
