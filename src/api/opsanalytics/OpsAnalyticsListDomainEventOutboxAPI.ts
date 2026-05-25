import { APIMessage } from '@/system/api';
import type { DomainEventOutboxQuery, DomainEventOutboxRecord, ListEnvelope } from '@/objects';

export type OpsAnalyticsListDomainEventOutboxAPIRequest = DomainEventOutboxQuery;

export class OpsAnalyticsListDomainEventOutboxAPI extends APIMessage<ListEnvelope<DomainEventOutboxRecord>> {
  readonly query: DomainEventOutboxQuery;

  constructor(payload: OpsAnalyticsListDomainEventOutboxAPIRequest) {
    super();
    this.query = payload;
  }
}
