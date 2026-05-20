import { APIMessage } from '@/system/api';
import type { DomainEventOutboxBatchOperationResult } from '@/objects';

export interface OpsAnalyticsQuarantineDomainEventOutboxAPIRequest {
  operatorId: string;
  recordIds: string[];
  reason: string;
}

export class OpsAnalyticsQuarantineDomainEventOutboxAPI extends APIMessage<DomainEventOutboxBatchOperationResult> {
  readonly operatorId: string;
  readonly recordIds: string[];
  readonly reason: string;

  constructor(payload: OpsAnalyticsQuarantineDomainEventOutboxAPIRequest) {
    super();
    this.operatorId = payload.operatorId;
    this.recordIds = payload.recordIds;
    this.reason = payload.reason;
  }
}
