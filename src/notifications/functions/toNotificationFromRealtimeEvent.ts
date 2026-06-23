import type { RealtimeEvent } from '@/app/realtime/RealtimeEvent';
import { isNotificationType, type Notification } from '@/objects/notification';

// Converts realtime payloads into the same shape returned by notification APIs.
export function toNotificationFromRealtimeEvent(
  event: RealtimeEvent,
  recipientPlayerId: string,
): Notification {
  if (!isNotificationType(event.sourceEventType)) {
    throw new Error(`Unsupported notification type: ${event.sourceEventType}`);
  }

  return {
    id: event.id,
    recipientPlayerId,
    notificationType: event.sourceEventType,
    title: event.title ?? '系统通知',
    body: event.body ?? '',
    severity: event.severity ?? 'info',
    sourceService: 'realtime',
    sourceType: event.aggregateType,
    sourceId: event.aggregateId,
    actionUrl: event.actionUrl,
    readAt: null,
    createdAt: event.occurredAt,
    expiresAt: null,
    objects: {},
  };
}
