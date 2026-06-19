import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useAuthContext } from '@/app/auth/useAuthContext';
import {
  realtimeBrowserEventName,
  type RealtimeBrowserEvent,
} from '@/app/realtime/RealtimeEvent';
import type { Notification } from '@/objects/notification';
import { getNotificationOperatorId } from '../functions/getNotificationOperatorId';
import { getNotificationSnapshot } from '../functions/getNotificationSnapshot';
import { markAllNotificationsRead } from '../functions/markAllNotificationsRead';
import { markNotificationRead } from '../functions/markNotificationRead';
import { toNotificationFromRealtimeEvent } from '../functions/toNotificationFromRealtimeEvent';

export function useSystemNotifications() {
  const { isReady, session } = useAuthContext();
  const operatorId = getNotificationOperatorId(session);
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
      const snapshot = await getNotificationSnapshot(operatorId);
      setNotifications(snapshot.notifications);
      setUnreadCount(snapshot.unreadCount);
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
        await markNotificationRead(notificationId, operatorId);
      } catch (error) {
        console.error('Mark notification read failed.', error);
        return;
      }

      const wasUnread = notifications.some(
        (item) => item.id === notificationId && !item.readAt,
      );
      setNotifications((current) =>
        current.map((item) =>
          item.id === notificationId
            ? { ...item, readAt: item.readAt ?? new Date().toISOString() }
            : item,
        ),
      );
      if (wasUnread) {
        setUnreadCount((current) => Math.max(0, current - 1));
      }
    },
    [notifications, operatorId],
  );

  const markAllRead = useCallback(async () => {
    if (!operatorId || unreadCount <= 0) {
      return;
    }

    try {
      await markAllNotificationsRead(operatorId);
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
              toNotificationFromRealtimeEvent(realtimeEvent, operatorId),
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
