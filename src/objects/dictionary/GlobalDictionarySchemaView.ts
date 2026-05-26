import type { GlobalDictionarySchemaEntryView } from './GlobalDictionarySchemaEntryView';

export interface GlobalDictionarySchemaView {
  entries: GlobalDictionarySchemaEntryView[];
  unknownKeyPolicy: string;
}
