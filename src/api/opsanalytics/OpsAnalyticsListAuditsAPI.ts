import { APIMessage } from '@/system/api';
import type { AuditEventEntry, AuditEventQuery, ListEnvelope } from '@/objects';

export type OpsAnalyticsListAuditsAPIRequest = AuditEventQuery;

export class OpsAnalyticsListAuditsAPI extends APIMessage<ListEnvelope<AuditEventEntry>> {
  readonly query: AuditEventQuery;

  constructor(payload: OpsAnalyticsListAuditsAPIRequest) {
    super();
    this.query = payload;
  }
}
