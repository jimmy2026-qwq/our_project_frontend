import type { GlobalDictionarySchemaEntry } from './GlobalDictionarySchemaEntry';

export interface GlobalDictionarySchema {
  entries: GlobalDictionarySchemaEntry[];
  unknownKeyPolicy: string;
}
