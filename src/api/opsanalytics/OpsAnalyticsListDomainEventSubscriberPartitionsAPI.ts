import { APIMessage, encodeBackendOption } from '@/system/api';
import type { DomainEventSubscriberPartitionStatus, ListEnvelope } from '@/objects';

export interface OpsAnalyticsListDomainEventSubscriberPartitionsAPIRequest {
  operatorId: string;
  subscriberId: string;
  asOf?: string;
  lagOnly?: boolean;
  blockedOnly?: boolean;
  partitionKey?: string;
  limit?: number;
  offset?: number;
}

export class OpsAnalyticsListDomainEventSubscriberPartitionsAPI extends APIMessage<ListEnvelope<DomainEventSubscriberPartitionStatus>> {
  readonly operatorId: string;
  readonly subscriberId: string;
  readonly asOf: string[];
  readonly lagOnly: boolean[];
  readonly blockedOnly: boolean[];
  readonly partitionKey: string[];
  readonly limit: number[];
  readonly offset: number[];

  constructor(payload: OpsAnalyticsListDomainEventSubscriberPartitionsAPIRequest) {
    super();
    this.operatorId = payload.operatorId;
    this.subscriberId = payload.subscriberId;
    this.asOf = encodeBackendOption(payload.asOf);
    this.lagOnly = encodeBackendOption(payload.lagOnly);
    this.blockedOnly = encodeBackendOption(payload.blockedOnly);
    this.partitionKey = encodeBackendOption(payload.partitionKey);
    this.limit = encodeBackendOption(payload.limit);
    this.offset = encodeBackendOption(payload.offset);
  }
}
