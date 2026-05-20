export interface GlobalDictionarySchemaEntry {
  key: string;
  description: string;
  valueType: string;
  defaultValue: string;
}

export interface GlobalDictionarySchemaView {
  entries: GlobalDictionarySchemaEntry[];
  unknownKeyPolicy: string;
}

export interface GlobalDictionaryEntry {
  key: string;
  value: string;
  updatedBy?: string | null;
  updatedAt: string;
  note?: string | null;
}

export interface DictionaryNamespaceRegistration {
  namespacePrefix: string;
  status: string;
  requestedBy: string;
  requestedAt: string;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  ownerPlayerId: string;
  coOwnerPlayerIds: string[];
  editorPlayerIds: string[];
  contextClubId?: string | null;
  reviewDueAt?: string | null;
  note?: string | null;
}

export interface DictionaryNamespaceOwnerBacklog {
  ownerPlayerId: string;
  pendingCount: number;
  overdueCount: number;
  dueSoonCount: number;
}

export interface DictionaryNamespaceBacklogView {
  asOf: string;
  pendingCount: number;
  overdueCount: number;
  dueSoonCount: number;
  oldestPendingRequestedAt?: string | null;
  nextDueAt?: string | null;
  ownerBacklog: DictionaryNamespaceOwnerBacklog[];
}

export interface DictionaryNamespaceReminderAction {
  namespacePrefix: string;
  action: string;
  ownerPlayerId: string;
  occurredAt: string;
  note?: string | null;
}

export type GlobalDictionarySchemaResponse = GlobalDictionarySchemaView;
export type DictionaryNamespaceBacklogResponse = DictionaryNamespaceBacklogView;
