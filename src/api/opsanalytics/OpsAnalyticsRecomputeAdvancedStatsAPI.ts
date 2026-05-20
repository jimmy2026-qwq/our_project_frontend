import { APIMessage, encodeBackendOption } from '@/system/api';
import type { AdvancedStatsRecomputeTask } from '@/objects';

export interface OpsAnalyticsRecomputeAdvancedStatsAPIRequest {
  operatorId: string;
  mode?: string;
  ownerType?: string;
  ownerId?: string;
  reason?: string;
  limit?: number;
}

export class OpsAnalyticsRecomputeAdvancedStatsAPI extends APIMessage<AdvancedStatsRecomputeTask[]> {
  readonly operatorId: string;
  readonly mode: string;
  readonly ownerType: string[];
  readonly ownerId: string[];
  readonly reason: string[];
  readonly limit: number;

  constructor(payload: OpsAnalyticsRecomputeAdvancedStatsAPIRequest) {
    super();
    this.operatorId = payload.operatorId;
    this.mode = payload.mode ?? 'Full';
    this.ownerType = encodeBackendOption(payload.ownerType);
    this.ownerId = encodeBackendOption(payload.ownerId);
    this.reason = encodeBackendOption(payload.reason);
    this.limit = payload.limit ?? 500;
  }
}
