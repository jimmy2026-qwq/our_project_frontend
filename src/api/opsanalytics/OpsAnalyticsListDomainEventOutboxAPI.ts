import { APIMessage, encodeBackendOption } from '@/system/api';
import type { DomainEventOutboxRecord, ListEnvelope } from '@/objects';

export interface OpsAnalyticsListDomainEventOutboxAPIRequest {
  operatorId: string;
  asOf?: string;
  status?: string;
  eventType?: string;
  aggregateType?: string;
  aggregateId?: string;
  subscriberId?: string;
  partitionKey?: string;
  delivered?: boolean;
  blockedOnly?: boolean;
  limit?: number;
  offset?: number;
}

export class OpsAnalyticsListDomainEventOutboxAPI extends APIMessage<ListEnvelope<DomainEventOutboxRecord>> {
  readonly operatorId: string;
  readonly asOf: string[];
  readonly status: string[];
  readonly eventType: string[];
  readonly aggregateType: string[];
  readonly aggregateId: string[];
  readonly subscriberId: string[];
  readonly partitionKey: string[];
  readonly delivered: boolean[];
  readonly blockedOnly: boolean[];
  readonly limit: number[];
  readonly offset: number[];

  constructor(payload: OpsAnalyticsListDomainEventOutboxAPIRequest) {
    super();
    this.operatorId = payload.operatorId;
    this.asOf = encodeBackendOption(payload.asOf);
    this.status = encodeBackendOption(payload.status);
    this.eventType = encodeBackendOption(payload.eventType);
    this.aggregateType = encodeBackendOption(payload.aggregateType);
    this.aggregateId = encodeBackendOption(payload.aggregateId);
    this.subscriberId = encodeBackendOption(payload.subscriberId);
    this.partitionKey = encodeBackendOption(payload.partitionKey);
    this.delivered = encodeBackendOption(payload.delivered);
    this.blockedOnly = encodeBackendOption(payload.blockedOnly);
    this.limit = encodeBackendOption(payload.limit);
    this.offset = encodeBackendOption(payload.offset);
  }
}
