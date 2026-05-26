import { APIMessage } from '@/system/api';
import type { GlobalDictionaryEntryView } from '@/objects/dictionary';

export class DictionaryGetEntryAPI extends APIMessage<GlobalDictionaryEntryView> {
  readonly key: string;

  constructor(key: string) {
    super();
    this.key = key;
  }
}
