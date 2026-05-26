import { APIMessage } from '@/system/api';
import type {
  DictionaryNamespaceRegistrationView,
  UpdateDictionaryNamespaceCollaboratorsRequest,
} from '@/objects/dictionary';

export class DictionaryUpdateNamespaceCollaboratorsAPI extends APIMessage<DictionaryNamespaceRegistrationView> {
  readonly operatorId: string;
  readonly namespacePrefix: string;
  readonly coOwnerPlayerIds: string[];
  readonly editorPlayerIds: string[];
  readonly note?: string;

  constructor(payload: UpdateDictionaryNamespaceCollaboratorsRequest) {
    super();
    this.operatorId = payload.operatorId;
    this.namespacePrefix = payload.namespacePrefix;
    this.coOwnerPlayerIds = payload.coOwnerPlayerIds ?? [];
    this.editorPlayerIds = payload.editorPlayerIds ?? [];
    this.note = payload.note;
  }
}
