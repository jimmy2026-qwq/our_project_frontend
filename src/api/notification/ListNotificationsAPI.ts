import { APIMessage } from '@/system/api';
import type { Notification, NotificationListQuery } from '@/objects/notification';

export class ListNotificationsAPI extends APIMessage<Notification[]> {
  readonly query: NotificationListQuery;

  constructor(
    readonly operatorId: string,
    query: NotificationListQuery = {},
  ) {
    super();
    this.query = query;
  }
}
