import { APIMessage } from '@/system/api';
import type { AdvancedStatsBoard } from '@/objects';

export interface OpsAnalyticsPlayerAdvancedStatsAPIRequest {
  playerId: string;
  operatorId: string;
}

export class OpsAnalyticsPlayerAdvancedStatsAPI extends APIMessage<AdvancedStatsBoard> {
  readonly playerId: string;
  readonly operatorId: string;

  constructor(payload: OpsAnalyticsPlayerAdvancedStatsAPIRequest) {
    super();
    this.playerId = payload.playerId;
    this.operatorId = payload.operatorId;
  }
}
