import { APIMessage, encodeBackendOption } from '@/system/api';
import type { DomainEventOutboxRecord } from '@/objects';

export interface OpsAnalyticsAcknowledgeDomainEventOutboxRecordAPIRequest {
  recordId: string;
  operatorId: string;
  note?: string;
}

export class OpsAnalyticsAcknowledgeDomainEventOutboxRecordAPI extends APIMessage<DomainEventOutboxRecord> {
  readonly recordId: string;
  readonly operatorId: string;
  readonly note: string[];

  constructor(payload: OpsAnalyticsAcknowledgeDomainEventOutboxRecordAPIRequest) {
    super();
    this.recordId = payload.recordId;
    this.operatorId = payload.operatorId;
    this.note = encodeBackendOption(payload.note);
  }
}
