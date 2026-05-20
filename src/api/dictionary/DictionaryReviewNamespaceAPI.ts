import { APIMessage } from '@/system/api';
import type {
  DictionaryNamespaceRegistration,
  ReviewDictionaryNamespaceRequest,
} from '@/objects/dictionary';

export class DictionaryReviewNamespaceAPI extends APIMessage<DictionaryNamespaceRegistration> {
  readonly operatorId: string;
  readonly namespacePrefix: string;
  readonly approve: boolean;
  readonly note?: string;

  constructor(payload: ReviewDictionaryNamespaceRequest) {
    super();
    this.operatorId = payload.operatorId;
    this.namespacePrefix = payload.namespacePrefix;
    this.approve = payload.approve;
    this.note = payload.note;
  }
}
