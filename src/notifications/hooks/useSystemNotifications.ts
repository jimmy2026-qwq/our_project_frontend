import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useAuth } from '@/app/auth/useAuth';
import {
  realtimeBrowserEventName,
  type RealtimeBrowserEvent,
  type RealtimeEvent,
} from '@/app/realtime/RealtimeEvent';
import {
  GetUnreadNotificationCountAPI,
  ListNotificationsAPI,
  MarkAllNotificationsReadAPI,
  MarkNotificationReadAPI,
} from '@/api/notification';
import type { Notification } from '@/objects/notification';
import { sendAPI } from '@/system/api';

export function useSystemNotifications() {
  const { isReady, session } = useAuth();
  const operatorId = session?.user.roles.isRegisteredPlayer
    ? (session.user.operatorId ?? session.user.userId)
    : '';
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const seenRealtimeNotificationIds = useRef(new Set<string>());

  const refresh = useCallback(async (options?: { silent?: boolean; silentFailure?: boolean }) => {
    if (!operatorId) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    if (!options?.silent) {
      setIsLoading(true);
    }
    try {
      const [items, unread] = await Promise.all([
        sendAPI(new ListNotificationsAPI(operatorId, { limit: 40 })),
        sendAPI(new GetUnreadNotificationCountAPI(operatorId)),
      ]);
      setNotifications(items);
      setUnreadCount(unread.unreadCount);
    } catch (error) {
      if (!options?.silentFailure) {
        console.error('Notification refresh failed.', error);
      }
    } finally {
      if (!options?.silent) {
        setIsLoading(false);
      }
    }
  }, [operatorId]);

  const markRead = useCallback(
    async (notificationId: string) => {
      if (!operatorId) {
        return;
      }

      try {
        await sendAPI(new MarkNotificationReadAPI(notificationId, operatorId));
      } catch (error) {
        console.error('Mark notification read failed.', error);
        return;
      }

      setNotifications((current) =>
        current.map((item) =>
          item.id === notificationId
            ? { ...item, readAt: item.readAt ?? new Date().toISOString() }
            : item,
        ),
      );
      setUnreadCount((current) => Math.max(0, current - 1));
    },
    [operatorId],
  );

  const markAllRead = useCallback(async () => {
    if (!operatorId || unreadCount <= 0) {
      return;
    }

    try {
      await sendAPI(new MarkAllNotificationsReadAPI(operatorId));
    } catch (error) {
      console.error('Mark all notifications read failed.', error);
      return;
    }

    const readAt = new Date().toISOString();
    setNotifications((current) =>
      current.map((item) => ({ ...item, readAt: item.readAt ?? readAt })),
    );
    setUnreadCount(0);
  }, [operatorId, unreadCount]);

  useEffect(() => {
    if (!isReady || !operatorId) {
      return;
    }

    void refresh({ silentFailure: true });
  }, [isReady, operatorId, refresh]);

  useEffect(() => {
    if (!operatorId) {
      return;
    }

    const handleRealtimeEvent = (event: Event) => {
      const realtimeEvent = (event as RealtimeBrowserEvent).detail;

      if (
        realtimeEvent.eventType === 'NotificationCreated' &&
        realtimeEvent.recipientPlayerId === operatorId
      ) {
        if (!seenRealtimeNotificationIds.current.has(realtimeEvent.id)) {
          seenRealtimeNotificationIds.current.add(realtimeEvent.id);
          setNotifications((current) => {
            if (current.some((notification) => notification.id === realtimeEvent.id)) {
              return current;
            }

            return [
              notificationFromRealtimeEvent(realtimeEvent, operatorId),
              ...current,
            ].slice(0, 40);
          });
          setUnreadCount((current) => current + 1);
        }

        void refresh({ silent: true, silentFailure: true });
      }
    };

    window.addEventListener(realtimeBrowserEventName, handleRealtimeEvent);

    return () => {
      window.removeEventListener(realtimeBrowserEventName, handleRealtimeEvent);
    };
  }, [operatorId, refresh]);

  const contextValue = useMemo(
    () => ({
      notifications,
      unreadCount,
      isLoading,
      refresh,
      markRead,
      markAllRead,
    }),
    [notifications, unreadCount, isLoading, refresh, markRead, markAllRead],
  );

  return {
    contextValue,
    isEnabled: !!operatorId,
    isLoading,
    markAllRead,
    markRead,
    notifications,
    refresh,
    unreadCount,
  };
}

function notificationFromRealtimeEvent(
  event: RealtimeEvent,
  recipientPlayerId: string,
): Notification {
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
