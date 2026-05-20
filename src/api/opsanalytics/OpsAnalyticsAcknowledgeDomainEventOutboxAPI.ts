import { APIMessage, encodeBackendOption } from '@/system/api';
import type { DomainEventOutboxBatchOperationResult } from '@/objects';

export interface OpsAnalyticsAcknowledgeDomainEventOutboxAPIRequest {
  operatorId: string;
  recordIds: string[];
  note?: string;
}

export class OpsAnalyticsAcknowledgeDomainEventOutboxAPI extends APIMessage<DomainEventOutboxBatchOperationResult> {
  readonly operatorId: string;
  readonly recordIds: string[];
  readonly note: string[];

  constructor(payload: OpsAnalyticsAcknowledgeDomainEventOutboxAPIRequest) {
    super();
    this.operatorId = payload.operatorId;
    this.recordIds = payload.recordIds;
    this.note = encodeBackendOption(payload.note);
  }
}
