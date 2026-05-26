import { APIMessage } from '@/system/api';
import type {
  GlobalDictionaryEntryView,
  UpsertDictionaryRequest,
} from '@/objects/dictionary';

export class DictionaryUpsertEntryAPI extends APIMessage<GlobalDictionaryEntryView> {
  readonly operatorId: string;
  readonly key: string;
  readonly value: string;
  readonly note?: string;

  constructor(payload: UpsertDictionaryRequest) {
    super();
    this.operatorId = payload.operatorId;
    this.key = payload.key;
    this.value = payload.value;
    this.note = payload.note;
  }
}
