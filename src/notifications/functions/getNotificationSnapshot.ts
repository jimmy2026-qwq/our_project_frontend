import { GetUnreadNotificationCountAPI, ListNotificationsAPI } from '@/api/notification';
import type { Notification } from '@/objects/notification';
import { sendAPI } from '@/system/api';

export interface NotificationSnapshot {
  notifications: Notification[];
  unreadCount: number;
}

// Loads the panel list and badge count as one UI snapshot.
export async function getNotificationSnapshot(
  operatorId: string,
): Promise<NotificationSnapshot> {
  const [items, unread] = await Promise.all([
    sendAPI(new ListNotificationsAPI(operatorId, { limit: 40 })),
    sendAPI(new GetUnreadNotificationCountAPI(operatorId)),
  ]);

  return {
    notifications: items,
    unreadCount: unread.unreadCount,
  };
}
