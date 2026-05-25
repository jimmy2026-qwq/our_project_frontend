import { APIMessage, encodeBackendOption } from '@/system/api';
import type { AdvancedStatsRecomputeTask, ListEnvelope } from '@/objects';
import type { BackendOption } from '@/system/api';

export interface OpsAnalyticsListAdvancedStatsTasksAPIRequest {
  operatorId: string;
  status?: AdvancedStatsRecomputeTask['status'];
  limit?: number;
  offset?: number;
}

export class OpsAnalyticsListAdvancedStatsTasksAPI extends APIMessage<ListEnvelope<AdvancedStatsRecomputeTask>> {
  readonly operatorId: string;
  readonly status: BackendOption<AdvancedStatsRecomputeTask['status']>;
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
