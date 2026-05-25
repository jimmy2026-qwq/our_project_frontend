import { APIMessage } from '@/system/api';
import type { DomainEventSubscriberStatus, DomainEventSubscribersQuery, ListEnvelope } from '@/objects';

export type OpsAnalyticsListDomainEventSubscribersAPIRequest = DomainEventSubscribersQuery;

export class OpsAnalyticsListDomainEventSubscribersAPI extends APIMessage<ListEnvelope<DomainEventSubscriberStatus>> {
  readonly query: DomainEventSubscribersQuery;

  constructor(payload: OpsAnalyticsListDomainEventSubscribersAPIRequest) {
    super();
    this.query = payload;
  }
}
