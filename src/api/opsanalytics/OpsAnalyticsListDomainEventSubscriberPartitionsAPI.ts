import { APIMessage } from '@/system/api';
import type { DomainEventSubscriberPartitionStatus, DomainEventSubscriberPartitionsQuery, ListEnvelope } from '@/objects';

export type OpsAnalyticsListDomainEventSubscriberPartitionsAPIRequest = DomainEventSubscriberPartitionsQuery;

export class OpsAnalyticsListDomainEventSubscriberPartitionsAPI extends APIMessage<ListEnvelope<DomainEventSubscriberPartitionStatus>> {
  readonly query: DomainEventSubscriberPartitionsQuery;

  constructor(payload: OpsAnalyticsListDomainEventSubscriberPartitionsAPIRequest) {
    super();
    this.query = payload;
  }
}
