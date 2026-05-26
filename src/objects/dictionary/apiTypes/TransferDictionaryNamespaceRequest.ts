export interface TransferDictionaryNamespaceRequest {
  operatorId: string;
  namespacePrefix: string;
  newOwnerPlayerId: string;
  note?: string;
}
