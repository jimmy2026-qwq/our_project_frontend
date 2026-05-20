export interface DictionaryNamespaceBacklogQuery {
  operatorId: string;
  asOf?: string;
  dueSoonHours?: number;
}

export interface DictionaryListNamespacesQuery {
  operatorId: string;
  status?: string;
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

export interface RequestDictionaryNamespaceRequest {
  operatorId: string;
  namespacePrefix: string;
  contextClubId?: string;
  ownerPlayerId?: string;
  coOwnerPlayerIds?: string[];
  editorPlayerIds?: string[];
  note?: string;
  reviewDueAt?: string;
}

export interface ReviewDictionaryNamespaceRequest {
  operatorId: string;
  namespacePrefix: string;
  approve: boolean;
  note?: string;
}

export interface TransferDictionaryNamespaceRequest {
  operatorId: string;
  namespacePrefix: string;
  newOwnerPlayerId: string;
  note?: string;
}

export interface UpdateDictionaryNamespaceCollaboratorsRequest {
  operatorId: string;
  namespacePrefix: string;
  coOwnerPlayerIds?: string[];
  editorPlayerIds?: string[];
  note?: string;
}

export interface UpdateDictionaryNamespaceContextRequest {
  operatorId: string;
  namespacePrefix: string;
  contextClubId?: string;
  note?: string;
}

export interface ProcessDictionaryNamespaceRemindersRequest {
  operatorId: string;
  asOf?: string;
  dueSoonHours?: number;
  reminderIntervalHours?: number;
  escalationGraceHours?: number;
}

export interface RevokeDictionaryNamespaceRequest {
  operatorId: string;
  namespacePrefix: string;
  note?: string;
}
