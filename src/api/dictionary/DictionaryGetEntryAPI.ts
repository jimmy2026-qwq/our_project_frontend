import { APIMessage } from '@/system/api';
import type { GlobalDictionaryEntry } from '@/objects/dictionary';

export class DictionaryGetEntryAPI extends APIMessage<GlobalDictionaryEntry> {
  readonly key: string;

  constructor(key: string) {
    super();
    this.key = key;
  }
}
