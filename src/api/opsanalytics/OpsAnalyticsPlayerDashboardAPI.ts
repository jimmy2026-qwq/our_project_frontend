import { APIMessage } from '@/system/api';
import type { Dashboard } from '@/objects/opsanalytics';

export interface OpsAnalyticsPlayerDashboardAPIRequest {
  playerId: string;
  operatorId: string;
}

export class OpsAnalyticsPlayerDashboardAPI extends APIMessage<Dashboard> {
  readonly playerId: string;
  readonly operatorId: string;

  constructor(payload: OpsAnalyticsPlayerDashboardAPIRequest) {
    super();
    this.playerId = payload.playerId;
    this.operatorId = payload.operatorId;
  }
}
