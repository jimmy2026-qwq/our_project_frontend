import { APIMessage } from '@/system/api';
import type { NotificationUnreadCountView } from '@/objects/notification';

export class GetUnreadNotificationCountAPI extends APIMessage<NotificationUnreadCountView> {
  constructor(readonly operatorId: string) {
    super();
  }
}
