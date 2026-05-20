import { APIMessage, encodeBackendOption } from '@/system/api';
import type { AuditEventEntry, ListEnvelope } from '@/objects';

export interface OpsAnalyticsListAggregateAuditsAPIRequest {
  operatorId: string;
  aggregateType: string;
  aggregateId: string;
  actorId?: string;
  eventType?: string;
  limit?: number;
  offset?: number;
}

export class OpsAnalyticsListAggregateAuditsAPI extends APIMessage<ListEnvelope<AuditEventEntry>> {
  readonly operatorId: string;
  readonly aggregateType: string;
  readonly aggregateId: string;
  readonly actorId: string[];
  readonly eventType: string[];
  readonly limit: number[];
  readonly offset: number[];

  constructor(payload: OpsAnalyticsListAggregateAuditsAPIRequest) {
    super();
    this.operatorId = payload.operatorId;
    this.aggregateType = payload.aggregateType;
    this.aggregateId = payload.aggregateId;
    this.actorId = encodeBackendOption(payload.actorId);
    this.eventType = encodeBackendOption(payload.eventType);
    this.limit = encodeBackendOption(payload.limit);
    this.offset = encodeBackendOption(payload.offset);
  }
}
