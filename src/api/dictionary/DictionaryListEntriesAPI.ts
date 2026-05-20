import { APIMessage } from '@/system/api';
import type {
  DictionaryListEntriesQuery,
  GlobalDictionaryEntry,
  ListEnvelope,
} from '@/objects';

export class DictionaryListEntriesAPI extends APIMessage<ListEnvelope<GlobalDictionaryEntry>> {
  readonly prefix?: string;
  readonly updatedBy?: string;
  readonly limit?: number;
  readonly offset?: number;

  constructor(filters: DictionaryListEntriesQuery = {}) {
    super();
    Object.assign(this, filters);
  }
}
