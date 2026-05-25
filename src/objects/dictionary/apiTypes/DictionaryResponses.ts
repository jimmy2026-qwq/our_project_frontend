export interface GlobalDictionarySchemaEntry {
  key: string;
  description: string;
  valueType:
    | 'Integer'
    | 'Decimal'
    | 'Weight'
    | 'RatioVector'
    | 'StageRuleTemplate'
    | 'Metadata';
  defaultValue: string;
}

export interface GlobalDictionarySchemaView {
  entries: GlobalDictionarySchemaEntry[];
  unknownKeyPolicy: string;
}

export interface GlobalDictionaryEntry {
  key: string;
  value: string;
  updatedBy: string | null;
  updatedAt: string;
  note: string | null;
}

export type DictionaryNamespaceStatus = 'Pending' | 'Approved' | 'Rejected' | 'Revoked';

export interface DictionaryNamespaceRegistration {
  namespacePrefix: string;
  status: DictionaryNamespaceStatus;
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
  oldestPendingRequestedAt: string | null;
  nextDueAt: string | null;
  ownerBacklog: DictionaryNamespaceOwnerBacklog[];
}

export interface DictionaryNamespaceReminderAction {
  namespacePrefix: string;
  action: string;
  ownerPlayerId: string;
  occurredAt: string;
  note: string | null;
}

export type GlobalDictionarySchemaResponse = GlobalDictionarySchemaView;
export type DictionaryNamespaceBacklogResponse = DictionaryNamespaceBacklogView;
