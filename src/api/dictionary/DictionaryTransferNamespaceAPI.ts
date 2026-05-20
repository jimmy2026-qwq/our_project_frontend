import { APIMessage } from '@/system/api';
import type {
  DictionaryNamespaceRegistration,
  TransferDictionaryNamespaceRequest,
} from '@/objects/dictionary';

export class DictionaryTransferNamespaceAPI extends APIMessage<DictionaryNamespaceRegistration> {
  readonly operatorId: string;
  readonly namespacePrefix: string;
  readonly newOwnerPlayerId: string;
  readonly note?: string;

  constructor(payload: TransferDictionaryNamespaceRequest) {
    super();
    this.operatorId = payload.operatorId;
    this.namespacePrefix = payload.namespacePrefix;
    this.newOwnerPlayerId = payload.newOwnerPlayerId;
    this.note = payload.note;
  }
}
