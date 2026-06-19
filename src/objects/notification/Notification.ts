import type { NotificationId } from './NotificationId';
import type { PlayerId } from '../player/playerprofile';

export interface Notification {
  id: NotificationId;
  recipientPlayerId: PlayerId;
  notificationType: string;
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
