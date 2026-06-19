import { MarkAllNotificationsReadAPI } from '@/api/notification';
import { sendAPI } from '@/system/api';

// Calls the bulk-read notification endpoint used by the notification center.
export function markAllNotificationsRead(operatorId: string) {
  return sendAPI(new MarkAllNotificationsReadAPI(operatorId));
}
