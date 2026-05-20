import { APIMessage } from '@/system/api';
import type { AdvancedStatsRecomputeTask } from '@/objects';

export interface OpsAnalyticsProcessAdvancedStatsAPIRequest {
  operatorId: string;
  limit?: number;
}

export class OpsAnalyticsProcessAdvancedStatsAPI extends APIMessage<AdvancedStatsRecomputeTask[]> {
  readonly operatorId: string;
  readonly limit: number;

  constructor(payload: OpsAnalyticsProcessAdvancedStatsAPIRequest) {
    super();
    this.operatorId = payload.operatorId;
    this.limit = payload.limit ?? 50;
  }
}
