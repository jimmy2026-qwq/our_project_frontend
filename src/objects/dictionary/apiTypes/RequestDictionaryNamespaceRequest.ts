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
