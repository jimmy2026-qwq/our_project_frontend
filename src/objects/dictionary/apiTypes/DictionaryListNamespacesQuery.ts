import type { DictionaryNamespaceReviewStatus } from '../DictionaryNamespaceReviewStatus';

export interface DictionaryListNamespacesQuery {
  operatorId: string;
  status?: DictionaryNamespaceReviewStatus;
  contextClubId?: string;
  ownerId?: string;
  requestedBy?: string;
  reviewedBy?: string;
  asOf?: string;
  overdueOnly?: boolean;
  dueBefore?: string;
  dueAfter?: string;
  limit?: number;
  offset?: number;
}
