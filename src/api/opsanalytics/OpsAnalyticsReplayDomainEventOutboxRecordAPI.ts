import { APIMessage, encodeBackendOption } from '@/system/api';
import type { DomainEventOutboxRecord } from '@/objects';

export interface OpsAnalyticsReplayDomainEventOutboxRecordAPIRequest {
  recordId: string;
  operatorId: string;
  replayAt?: string;
  note?: string;
}

export class OpsAnalyticsReplayDomainEventOutboxRecordAPI extends APIMessage<DomainEventOutboxRecord> {
  readonly recordId: string;
  readonly operatorId: string;
  readonly replayAt: string[];
  readonly note: string[];

  constructor(payload: OpsAnalyticsReplayDomainEventOutboxRecordAPIRequest) {
    super();
    this.recordId = payload.recordId;
    this.operatorId = payload.operatorId;
    this.replayAt = encodeBackendOption(payload.replayAt);
    this.note = encodeBackendOption(payload.note);
  }
}
