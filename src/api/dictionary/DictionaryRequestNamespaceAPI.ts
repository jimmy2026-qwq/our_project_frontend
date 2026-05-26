import { APIMessage } from '@/system/api';
import type {
  DictionaryNamespaceRegistrationView,
  RequestDictionaryNamespaceRequest,
} from '@/objects/dictionary';

export class DictionaryRequestNamespaceAPI extends APIMessage<DictionaryNamespaceRegistrationView> {
  readonly request: RequestDictionaryNamespaceRequest;

  constructor(payload: RequestDictionaryNamespaceRequest) {
    super();
    this.request = {
      ...payload,
      coOwnerPlayerIds: payload.coOwnerPlayerIds ?? [],
      editorPlayerIds: payload.editorPlayerIds ?? [],
    };
  }
}
