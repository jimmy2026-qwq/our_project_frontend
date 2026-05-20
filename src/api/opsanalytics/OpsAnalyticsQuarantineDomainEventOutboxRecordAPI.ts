import { APIMessage } from '@/system/api';
import type { DomainEventOutboxRecord } from '@/objects';

export interface OpsAnalyticsQuarantineDomainEventOutboxRecordAPIRequest {
  recordId: string;
  operatorId: string;
  reason: string;
}

export class OpsAnalyticsQuarantineDomainEventOutboxRecordAPI extends APIMessage<DomainEventOutboxRecord> {
  readonly recordId: string;
  readonly operatorId: string;
  readonly reason: string;

  constructor(payload: OpsAnalyticsQuarantineDomainEventOutboxRecordAPIRequest) {
    super();
    this.recordId = payload.recordId;
    this.operatorId = payload.operatorId;
    this.reason = payload.reason;
  }
}
