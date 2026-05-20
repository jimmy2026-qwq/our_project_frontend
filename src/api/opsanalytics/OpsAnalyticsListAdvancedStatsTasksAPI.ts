import { APIMessage, encodeBackendOption } from '@/system/api';
import type { AdvancedStatsRecomputeTask, ListEnvelope } from '@/objects';

export interface OpsAnalyticsListAdvancedStatsTasksAPIRequest {
  operatorId: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export class OpsAnalyticsListAdvancedStatsTasksAPI extends APIMessage<ListEnvelope<AdvancedStatsRecomputeTask>> {
  readonly operatorId: string;
  readonly status: string[];
  readonly limit: number[];
  readonly offset: number[];

  constructor(payload: OpsAnalyticsListAdvancedStatsTasksAPIRequest) {
    super();
    this.operatorId = payload.operatorId;
    this.status = encodeBackendOption(payload.status);
    this.limit = encodeBackendOption(payload.limit);
    this.offset = encodeBackendOption(payload.offset);
  }
}
