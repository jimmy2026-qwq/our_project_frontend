import type { NotificationId } from './NotificationId';
import type { NotificationType } from './NotificationType';
import type { PlayerId } from '../player';

export interface Notification {
  id: NotificationId;
  recipientPlayerId: PlayerId;
  notificationType: NotificationType;
  title: string;
  body: string;
  severity: string;
  sourceService: string;
  sourceType: string;
  sourceId: string;
  actionUrl?: string | null;
  readAt?: string | null;
  createdAt: string;
  expiresAt?: string | null;
  objects: Record<string, string>;
}
