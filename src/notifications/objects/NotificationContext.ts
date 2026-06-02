import { createContext } from 'react';

import type { Notification } from '@/objects/notification';

export interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  refresh: () => Promise<void>;
  markRead: (notificationId: string) => Promise<void>;
  markAllRead: () => Promise<void>;
}

export const NotificationContext =
  createContext<NotificationContextValue | null>(null);
