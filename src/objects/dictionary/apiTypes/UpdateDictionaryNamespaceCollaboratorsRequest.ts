export interface UpdateDictionaryNamespaceCollaboratorsRequest {
  operatorId: string;
  namespacePrefix: string;
  coOwnerPlayerIds?: string[];
  editorPlayerIds?: string[];
  note?: string;
}
