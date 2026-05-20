import { APIMessage, encodeBackendOption } from '@/system/api';
import type { PerformanceDiagnosticsSnapshot } from '@/objects/opsanalytics';

export interface OpsAnalyticsPerformanceSummaryAPIRequest {
  operatorId: string;
  limit?: number;
}

export class OpsAnalyticsPerformanceSummaryAPI extends APIMessage<PerformanceDiagnosticsSnapshot> {
  readonly operatorId: string;
  readonly limit: number[];

  constructor(payload: OpsAnalyticsPerformanceSummaryAPIRequest) {
    super();
    this.operatorId = payload.operatorId;
    this.limit = encodeBackendOption(payload.limit);
  }
}
