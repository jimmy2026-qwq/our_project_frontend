export interface Notification {
  id: string;
  recipientPlayerId: string;
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
