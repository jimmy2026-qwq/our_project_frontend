import { APIMessage } from '@/system/api';
import { AdvancedStatsBackfillModes } from '@/objects';
import type { AdvancedStatsRecomputeRequest, AdvancedStatsRecomputeTask } from '@/objects';

export type OpsAnalyticsRecomputeAdvancedStatsAPIRequest = AdvancedStatsRecomputeRequest;

export class OpsAnalyticsRecomputeAdvancedStatsAPI extends APIMessage<AdvancedStatsRecomputeTask[]> {
  readonly request: AdvancedStatsRecomputeRequest;

  constructor(payload: OpsAnalyticsRecomputeAdvancedStatsAPIRequest) {
    super();
    this.request = {
      ...payload,
      mode: payload.mode ?? AdvancedStatsBackfillModes.Full,
      limit: payload.limit ?? 500,
    };
  }
}
