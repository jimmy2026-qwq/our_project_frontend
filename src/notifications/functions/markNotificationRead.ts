import { MarkNotificationReadAPI } from '@/api/notification';
import { sendAPI } from '@/system/api';

// Calls the single-notification read endpoint used by notification items.
export function markNotificationRead(
  notificationId: string,
  operatorId: string,
) {
  return sendAPI(new MarkNotificationReadAPI(notificationId, operatorId));
}
