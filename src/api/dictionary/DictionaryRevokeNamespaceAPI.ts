import { APIMessage } from '@/system/api';
import type {
  DictionaryNamespaceRegistrationView,
  RevokeDictionaryNamespaceRequest,
} from '@/objects/dictionary';

export class DictionaryRevokeNamespaceAPI extends APIMessage<DictionaryNamespaceRegistrationView> {
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
