import { APIMessage, encodeBackendOption } from '@/system/api';
import type { EventCascadeRecord, ListEnvelope } from '@/objects';

export interface OpsAnalyticsListEventCascadeRecordsAPIRequest {
  operatorId: string;
  status?: string;
  consumer?: string;
  eventType?: string;
  aggregateType?: string;
  aggregateId?: string;
  limit?: number;
  offset?: number;
}

export class OpsAnalyticsListEventCascadeRecordsAPI extends APIMessage<ListEnvelope<EventCascadeRecord>> {
  readonly operatorId: string;
  readonly status: string[];
  readonly consumer: string[];
  readonly eventType: string[];
  readonly aggregateType: string[];
  readonly aggregateId: string[];
  readonly limit: number[];
  readonly offset: number[];

  constructor(payload: OpsAnalyticsListEventCascadeRecordsAPIRequest) {
    super();
    this.operatorId = payload.operatorId;
    this.status = encodeBackendOption(payload.status);
    this.consumer = encodeBackendOption(payload.consumer);
    this.eventType = encodeBackendOption(payload.eventType);
    this.aggregateType = encodeBackendOption(payload.aggregateType);
    this.aggregateId = encodeBackendOption(payload.aggregateId);
    this.limit = encodeBackendOption(payload.limit);
    this.offset = encodeBackendOption(payload.offset);
  }
}
