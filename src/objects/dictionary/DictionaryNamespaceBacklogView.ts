import type { DictionaryNamespaceOwnerBacklog } from './DictionaryNamespaceOwnerBacklog';

export interface DictionaryNamespaceBacklogView {
  asOf: string;
  pendingCount: number;
  overdueCount: number;
  dueSoonCount: number;
  oldestPendingRequestedAt: string | null;
  nextDueAt: string | null;
  ownerBacklog: DictionaryNamespaceOwnerBacklog[];
}
