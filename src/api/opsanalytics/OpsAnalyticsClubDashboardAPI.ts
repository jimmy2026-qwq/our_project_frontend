import { APIMessage } from '@/system/api';
import type { Dashboard } from '@/objects/opsanalytics';

export interface OpsAnalyticsClubDashboardAPIRequest {
  clubId: string;
  operatorId: string;
}

export class OpsAnalyticsClubDashboardAPI extends APIMessage<Dashboard> {
  readonly clubId: string;
  readonly operatorId: string;

  constructor(payload: OpsAnalyticsClubDashboardAPIRequest) {
    super();
    this.clubId = payload.clubId;
    this.operatorId = payload.operatorId;
  }
}
