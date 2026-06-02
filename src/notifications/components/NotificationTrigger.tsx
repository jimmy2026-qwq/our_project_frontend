import { notificationCenterClassNames } from '../styles';

interface NotificationTriggerProps {
  isOpen: boolean;
  unreadCount: number;
  onToggle: () => void;
}

export function NotificationTrigger({
  isOpen,
  unreadCount,
  onToggle,
}: NotificationTriggerProps) {
  return (
    <button
      type="button"
      className={notificationCenterClassNames.trigger}
      aria-label="系统消息"
      aria-expanded={isOpen}
      aria-controls="notification-center"
      title="系统消息"
      onClick={onToggle}
    >
      <span
        className={notificationCenterClassNames.triggerIcon}
        aria-hidden="true"
      >
        !
      </span>
      {unreadCount > 0 ? (
        <span className={notificationCenterClassNames.unread}>
          {unreadCount}
        </span>
      ) : null}
    </button>
  );
}
