import { APIMessage } from '@/system/api';
import type { DomainEventOutboxHistoryView } from '@/objects';

export interface OpsAnalyticsDomainEventOutboxHistoryAPIRequest {
  operatorId: string;
  recordId: string;
}

export class OpsAnalyticsDomainEventOutboxHistoryAPI extends APIMessage<DomainEventOutboxHistoryView> {
  readonly operatorId: string;
  readonly recordId: string;

  constructor(payload: OpsAnalyticsDomainEventOutboxHistoryAPIRequest) {
    super();
    this.operatorId = payload.operatorId;
    this.recordId = payload.recordId;
  }
}
