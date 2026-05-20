import { APIMessage, encodeBackendOption } from '@/system/api';
import type { AuditEventEntry, ListEnvelope } from '@/objects';

export interface OpsAnalyticsListAuditsAPIRequest {
  operatorId: string;
  aggregateType?: string;
  aggregateId?: string;
  actorId?: string;
  eventType?: string;
  limit?: number;
  offset?: number;
}

export class OpsAnalyticsListAuditsAPI extends APIMessage<ListEnvelope<AuditEventEntry>> {
  readonly operatorId: string;
  readonly aggregateType: string[];
  readonly aggregateId: string[];
  readonly actorId: string[];
  readonly eventType: string[];
  readonly limit: number[];
  readonly offset: number[];

  constructor(payload: OpsAnalyticsListAuditsAPIRequest) {
    super();
    this.operatorId = payload.operatorId;
    this.aggregateType = encodeBackendOption(payload.aggregateType);
    this.aggregateId = encodeBackendOption(payload.aggregateId);
    this.actorId = encodeBackendOption(payload.actorId);
    this.eventType = encodeBackendOption(payload.eventType);
    this.limit = encodeBackendOption(payload.limit);
    this.offset = encodeBackendOption(payload.offset);
  }
}
