import type { GlobalDictionaryValueType } from './GlobalDictionaryValueType';

export interface GlobalDictionarySchemaEntryView {
  key: string;
  description: string;
  valueType: GlobalDictionaryValueType;
  defaultValue: string;
}
