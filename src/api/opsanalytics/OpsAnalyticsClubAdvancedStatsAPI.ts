import { APIMessage } from '@/system/api';
import type { AdvancedStatsBoard } from '@/objects';

export interface OpsAnalyticsClubAdvancedStatsAPIRequest {
  clubId: string;
  operatorId: string;
}

export class OpsAnalyticsClubAdvancedStatsAPI extends APIMessage<AdvancedStatsBoard> {
  readonly clubId: string;
  readonly operatorId: string;

  constructor(payload: OpsAnalyticsClubAdvancedStatsAPIRequest) {
    super();
    this.clubId = payload.clubId;
    this.operatorId = payload.operatorId;
  }
}
