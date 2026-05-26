import type { GlobalDictionaryValueType } from './GlobalDictionaryValueType';

export interface GlobalDictionarySchemaEntry {
  id: string;
  keyPattern: string;
  valueType: GlobalDictionaryValueType;
  description: string;
  validationHint: string;
  runtimeConsumers: string[];
  examples: string[];
}
