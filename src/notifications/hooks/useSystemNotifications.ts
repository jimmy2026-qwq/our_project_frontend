import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/app/auth/useAuth';
import {
  realtimeBrowserEventName,
  type RealtimeBrowserEvent,
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
  const operatorId = session?.user.operatorId ?? session?.user.userId ?? '';
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!operatorId) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    setIsLoading(true);
    try {
      const [items, unread] = await Promise.all([
        sendAPI(new ListNotificationsAPI(operatorId, { limit: 40 })),
        sendAPI(new GetUnreadNotificationCountAPI(operatorId)),
      ]);
      setNotifications(items);
      setUnreadCount(unread.unreadCount);
    } catch (error) {
      console.error('Notification refresh failed.', error);
    } finally {
      setIsLoading(false);
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

    void refresh();
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
        void refresh();
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
