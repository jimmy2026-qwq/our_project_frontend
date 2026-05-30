import type { AppealAttachmentRequest } from './AppealAttachmentRequest';
import type { AppealPriority } from '../AppealPriority';

export interface FileAppealRequest {
  playerId: string;
  description: string;
  attachments?: AppealAttachmentRequest[];
  priority?: AppealPriority;
  dueAt?: string;
}
