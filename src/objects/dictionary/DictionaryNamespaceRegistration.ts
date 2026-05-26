import type { DictionaryNamespaceReviewStatus } from './DictionaryNamespaceReviewStatus';

export interface DictionaryNamespaceRegistration {
  namespacePrefix: string;
  contextClubId: string | null;
  ownerPlayerId: string;
  coOwnerPlayerIds: string[];
  editorPlayerIds: string[];
  requestedBy: string;
  requestedAt: string;
  reviewDueAt: string | null;
  lastReminderAt: string | null;
  reminderCount: number;
  status: DictionaryNamespaceReviewStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  version: number;
}
