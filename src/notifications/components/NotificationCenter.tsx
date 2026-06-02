import type { Notification } from '@/objects/notification';

import { useNotificationDisclosure } from '../hooks/useNotificationDisclosure';
import { NotificationPanel } from './NotificationPanel';
import { NotificationTrigger } from './NotificationTrigger';

interface NotificationCenterProps {
  isEnabled: boolean;
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  onMarkRead: (notificationId: string) => Promise<void>;
  onMarkAllRead: () => Promise<void>;
}

export function NotificationCenter({
  isEnabled,
  notifications,
  unreadCount,
  isLoading,
  onMarkRead,
  onMarkAllRead,
}: NotificationCenterProps) {
  const { containerRef, isOpen, toggle } = useNotificationDisclosure();

  if (!isEnabled) {
    return null;
  }

  return (
    <div ref={containerRef}>
      <NotificationTrigger
        isOpen={isOpen}
        unreadCount={unreadCount}
        onToggle={toggle}
      />
      {isOpen ? (
        <NotificationPanel
          notifications={notifications}
          unreadCount={unreadCount}
          isLoading={isLoading}
          onMarkRead={onMarkRead}
          onMarkAllRead={onMarkAllRead}
        />
      ) : null}
    </div>
  );
}
