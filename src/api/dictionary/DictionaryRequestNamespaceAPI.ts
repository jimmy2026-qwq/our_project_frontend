import { APIMessage } from '@/system/api';
import type {
  DictionaryNamespaceRegistration,
  RequestDictionaryNamespaceRequest,
} from '@/objects/dictionary';

export class DictionaryRequestNamespaceAPI extends APIMessage<DictionaryNamespaceRegistration> {
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
