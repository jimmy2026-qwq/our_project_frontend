export interface ReviewDictionaryNamespaceRequest {
  operatorId: string;
  namespacePrefix: string;
  approve: boolean;
  note?: string;
}
