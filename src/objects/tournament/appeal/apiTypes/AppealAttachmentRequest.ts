import type { AppealAttachmentMediaKind } from './AppealAttachmentMediaKind';
import type { AppealAttachmentStorageKind } from './AppealAttachmentStorageKind';

export interface AppealAttachmentRequest {
  name: string;
  uri: string;
  contentType?: string | null;
  storageKind?: AppealAttachmentStorageKind | null;
  mediaKind?: AppealAttachmentMediaKind | null;
  checksum?: string | null;
  checksumAlgorithm?: string | null;
  sizeBytes?: number | null;
  uploadedAt?: string | null;
  retentionUntil?: string | null;
}

