import { APIMessage } from '@/system/api';
import type { Notification } from '@/objects/notification';

export class MarkNotificationReadAPI extends APIMessage<Notification | null> {
  constructor(
    readonly notificationId: string,
    readonly operatorId: string,
  ) {
    super();
  }
}
