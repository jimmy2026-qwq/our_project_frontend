import { APIMessage } from '@/system/api';
import type {
  DictionaryNamespaceRegistration,
  RevokeDictionaryNamespaceRequest,
} from '@/objects/dictionary';

export class DictionaryRevokeNamespaceAPI extends APIMessage<DictionaryNamespaceRegistration> {
  readonly operatorId: string;
  readonly namespacePrefix: string;
  readonly note?: string;

  constructor(payload: RevokeDictionaryNamespaceRequest) {
    super();
    this.operatorId = payload.operatorId;
    this.namespacePrefix = payload.namespacePrefix;
    this.note = payload.note;
  }
}
