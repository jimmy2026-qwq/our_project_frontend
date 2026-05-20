import { APIMessage, encodeBackendOption } from '@/system/api';
import type { DomainEventBusSummary } from '@/objects';

export interface OpsAnalyticsDomainEventsSummaryAPIRequest {
  operatorId: string;
  asOf?: string;
}

export class OpsAnalyticsDomainEventsSummaryAPI extends APIMessage<DomainEventBusSummary> {
  readonly operatorId: string;
  readonly asOf: string[];

  constructor(payload: OpsAnalyticsDomainEventsSummaryAPIRequest) {
    super();
    this.operatorId = payload.operatorId;
    this.asOf = encodeBackendOption(payload.asOf);
  }
}
