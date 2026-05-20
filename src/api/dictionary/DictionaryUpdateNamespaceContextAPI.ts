import { APIMessage } from '@/system/api';
import type {
  DictionaryNamespaceRegistration,
  UpdateDictionaryNamespaceContextRequest,
} from '@/objects/dictionary';

export class DictionaryUpdateNamespaceContextAPI extends APIMessage<DictionaryNamespaceRegistration> {
  readonly operatorId: string;
  readonly namespacePrefix: string;
  readonly contextClubId?: string;
  readonly note?: string;

  constructor(payload: UpdateDictionaryNamespaceContextRequest) {
    super();
    this.operatorId = payload.operatorId;
    this.namespacePrefix = payload.namespacePrefix;
    this.contextClubId = payload.contextClubId;
    this.note = payload.note;
  }
}
