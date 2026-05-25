import { APIMessage } from '@/system/api';
import type { EventCascadeRecord, EventCascadeRecordsQuery, ListEnvelope } from '@/objects';

export type OpsAnalyticsListEventCascadeRecordsAPIRequest = EventCascadeRecordsQuery;

export class OpsAnalyticsListEventCascadeRecordsAPI extends APIMessage<ListEnvelope<EventCascadeRecord>> {
  readonly query: EventCascadeRecordsQuery;

  constructor(payload: OpsAnalyticsListEventCascadeRecordsAPIRequest) {
    super();
    this.query = payload;
  }
}
