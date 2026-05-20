import { APIMessage, encodeBackendOption } from '@/system/api';
import type { AdvancedStatsTaskQueueSummary } from '@/objects';

export interface OpsAnalyticsAdvancedStatsSummaryAPIRequest {
  operatorId: string;
  asOf?: string;
}

export class OpsAnalyticsAdvancedStatsSummaryAPI extends APIMessage<AdvancedStatsTaskQueueSummary> {
  readonly operatorId: string;
  readonly asOf: string[];

  constructor(payload: OpsAnalyticsAdvancedStatsSummaryAPIRequest) {
    super();
    this.operatorId = payload.operatorId;
    this.asOf = encodeBackendOption(payload.asOf);
  }
}
