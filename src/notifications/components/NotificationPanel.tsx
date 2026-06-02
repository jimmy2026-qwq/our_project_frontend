import { Button } from '@/components/ui';
import type { Notification } from '@/objects/notification';

import { notificationCenterClassNames } from '../styles';
import { NotificationItem } from './NotificationItem';

interface NotificationPanelProps {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  onMarkRead: (notificationId: string) => Promise<void>;
  onMarkAllRead: () => Promise<void>;
}

export function NotificationPanel({
  notifications,
  unreadCount,
  isLoading,
  onMarkRead,
  onMarkAllRead,
}: NotificationPanelProps) {
  return (
    <aside
      id="notification-center"
      className={notificationCenterClassNames.panel}
      aria-label="系统消息"
    >
      <div className={notificationCenterClassNames.header}>
        <div>
          <div className={notificationCenterClassNames.title}>系统消息</div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          disabled={unreadCount <= 0}
          onClick={() => void onMarkAllRead()}
        >
          全部已读
        </Button>
      </div>

      <div className={notificationCenterClassNames.body}>
        {notifications.length === 0 ? (
          <div className={notificationCenterClassNames.empty}>
            {isLoading ? '正在加载系统消息...' : '暂无系统消息'}
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkRead={onMarkRead}
            />
          ))
        )}
      </div>
    </aside>
  );
}
