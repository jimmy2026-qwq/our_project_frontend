import { APIMessage, encodeBackendOption } from '@/system/api';
import type { DomainEventOutboxBatchOperationResult } from '@/objects';

export interface OpsAnalyticsReplayDomainEventOutboxAPIRequest {
  operatorId: string;
  recordIds: string[];
  replayAt?: string;
  note?: string;
}

export class OpsAnalyticsReplayDomainEventOutboxAPI extends APIMessage<DomainEventOutboxBatchOperationResult> {
  readonly operatorId: string;
  readonly recordIds: string[];
  readonly replayAt: string[];
  readonly note: string[];

  constructor(payload: OpsAnalyticsReplayDomainEventOutboxAPIRequest) {
    super();
    this.operatorId = payload.operatorId;
    this.recordIds = payload.recordIds;
    this.replayAt = encodeBackendOption(payload.replayAt);
    this.note = encodeBackendOption(payload.note);
  }
}
