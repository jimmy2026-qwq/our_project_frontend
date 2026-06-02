import { APIMessage } from '@/system/api';
import type { MarkAllNotificationsReadResponse } from '@/objects/notification';

export class MarkAllNotificationsReadAPI extends APIMessage<MarkAllNotificationsReadResponse> {
  constructor(readonly operatorId: string) {
    super();
  }
}
