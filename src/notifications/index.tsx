import type { ReactNode } from 'react';

import { NotificationCenter } from './components/NotificationCenter';
import { useSystemNotifications } from './hooks/useSystemNotifications';
import { NotificationContext } from './objects/NotificationContext';

export function NotificationProvider({ children }: { children: ReactNode }) {
  const notifications = useSystemNotifications();

  return (
    <NotificationContext.Provider value={notifications.contextValue}>
      {children}
      <NotificationCenter
        isEnabled={notifications.isEnabled}
        notifications={notifications.notifications}
        unreadCount={notifications.unreadCount}
        isLoading={notifications.isLoading}
        onMarkRead={notifications.markRead}
        onMarkAllRead={notifications.markAllRead}
      />
    </NotificationContext.Provider>
  );
}

export { useNotifications } from './hooks/useNotifications';
