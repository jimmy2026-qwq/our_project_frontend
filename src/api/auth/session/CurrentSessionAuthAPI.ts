import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { CurrentSessionQuery, CurrentSessionView } from '@/objects/auth';

export class CurrentSessionAuthAPI extends APIMessage<CurrentSessionView> {
  readonly operatorId: string[];
  readonly guestSessionId: string[];

  constructor(filters: CurrentSessionQuery) {
    super();
    this.operatorId = encodeBackendOption(filters.operatorId);
    this.guestSessionId = encodeBackendOption(filters.guestSessionId);
  }
}
