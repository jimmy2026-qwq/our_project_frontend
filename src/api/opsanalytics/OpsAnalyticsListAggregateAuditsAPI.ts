import { APIMessage } from '@/system/api';
import type { AggregateAuditEventQuery, AuditEventEntry, ListEnvelope } from '@/objects';

export type OpsAnalyticsListAggregateAuditsAPIRequest = AggregateAuditEventQuery;

export class OpsAnalyticsListAggregateAuditsAPI extends APIMessage<ListEnvelope<AuditEventEntry>> {
  readonly query: AggregateAuditEventQuery;

  constructor(payload: OpsAnalyticsListAggregateAuditsAPIRequest) {
    super();
    this.query = payload;
  }
}
