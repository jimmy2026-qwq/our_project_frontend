export interface DictionaryListEntriesQuery {
  prefix?: string;
  updatedBy?: string;
  limit?: number;
  offset?: number;
}

export interface UpsertDictionaryRequest {
  operatorId: string;
  key: string;
  value: string;
  note?: string;
}
