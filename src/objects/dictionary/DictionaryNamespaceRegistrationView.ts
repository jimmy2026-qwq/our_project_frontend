import type { DictionaryNamespaceReviewStatus } from './DictionaryNamespaceReviewStatus';

export interface DictionaryNamespaceRegistrationView {
  namespacePrefix: string;
  status: DictionaryNamespaceReviewStatus;
  requestedBy: string;
  requestedAt: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  ownerPlayerId: string;
  coOwnerPlayerIds: string[];
  editorPlayerIds: string[];
  contextClubId: string | null;
  reviewDueAt: string | null;
  note: string | null;
}
