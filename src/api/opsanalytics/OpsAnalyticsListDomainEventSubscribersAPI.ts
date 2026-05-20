import { APIMessage, encodeBackendOption } from '@/system/api';
import type { DomainEventSubscriberStatus, ListEnvelope } from '@/objects';

export interface OpsAnalyticsListDomainEventSubscribersAPIRequest {
  operatorId: string;
  asOf?: string;
  subscriberId?: string;
  limit?: number;
  offset?: number;
}

export class OpsAnalyticsListDomainEventSubscribersAPI extends APIMessage<ListEnvelope<DomainEventSubscriberStatus>> {
  readonly operatorId: string;
  readonly asOf: string[];
  readonly subscriberId: string[];
  readonly limit: number[];
  readonly offset: number[];

  constructor(payload: OpsAnalyticsListDomainEventSubscribersAPIRequest) {
    super();
    this.operatorId = payload.operatorId;
    this.asOf = encodeBackendOption(payload.asOf);
    this.subscriberId = encodeBackendOption(payload.subscriberId);
    this.limit = encodeBackendOption(payload.limit);
    this.offset = encodeBackendOption(payload.offset);
  }
}
