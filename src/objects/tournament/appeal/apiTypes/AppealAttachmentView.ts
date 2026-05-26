import type { AppealAttachmentMediaKind } from './AppealAttachmentMediaKind';
import type { AppealAttachmentStorageKind } from './AppealAttachmentStorageKind';

export interface AppealAttachmentView {
  name: string;
  uri: string;
  contentType: string | null;
  storageKind: AppealAttachmentStorageKind;
  mediaKind: AppealAttachmentMediaKind;
  sizeBytes: number | null;
  uploadedAt: string | null;
}

