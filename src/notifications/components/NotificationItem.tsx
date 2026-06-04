import { Link } from 'react-router-dom';

import { Badge } from '@/components/ui';
import { cx } from '@/components/ui/cx';
import type { Notification } from '@/objects/notification';

import { formatNotificationTime } from '../functions/formatNotificationTime';
import {
  getNotificationBadgeLabel,
  getNotificationBadgeVariant,
} from '../functions/getNotificationBadge';
import { notificationCenterClassNames } from '../styles';

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (notificationId: string) => Promise<void>;
}

export function NotificationItem({
  notification,
  onMarkRead,
}: NotificationItemProps) {
  const isUnread = !notification.readAt;
  const content = (
    <>
      <div className={notificationCenterClassNames.itemTop}>
        <div className={notificationCenterClassNames.itemTitle}>
          {notification.title}
        </div>
        <Badge variant={getNotificationBadgeVariant(notification)}>
          {getNotificationBadgeLabel(notification)}
        </Badge>
      </div>
      <div className={notificationCenterClassNames.itemBody}>
        {notification.body}
      </div>
      <div className={notificationCenterClassNames.meta}>
        <span>{formatNotificationTime(notification.createdAt)}</span>
        {isUnread ? <span>未读</span> : <span>已读</span>}
      </div>
    </>
  );

  const className = cx(
    notificationCenterClassNames.item,
    isUnread && notificationCenterClassNames.unreadItem,
  );
  const handleActivate = () => {
    if (isUnread) {
      void onMarkRead(notification.id);
    }
  };

  if (notification.actionUrl) {
    if (notification.actionUrl.startsWith('/')) {
      return (
        <Link className={className} to={notification.actionUrl} onClick={handleActivate}>
          {content}
        </Link>
      );
    }

    return (
      <a className={className} href={notification.actionUrl} onClick={handleActivate}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={className} onClick={handleActivate}>
      {content}
    </button>
  );
}
