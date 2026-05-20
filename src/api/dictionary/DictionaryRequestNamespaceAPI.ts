import { APIMessage } from '@/system/api';
import type {
  DictionaryNamespaceRegistration,
  RequestDictionaryNamespaceRequest,
} from '@/objects/dictionary';

export class DictionaryRequestNamespaceAPI extends APIMessage<DictionaryNamespaceRegistration> {
  readonly operatorId: string;
  readonly namespacePrefix: string;
  readonly contextClubId?: string;
  readonly ownerPlayerId?: string;
  readonly coOwnerPlayerIds: string[];
  readonly editorPlayerIds: string[];
  readonly note?: string;
  readonly reviewDueAt?: string;

  constructor(payload: RequestDictionaryNamespaceRequest) {
    super();
    this.operatorId = payload.operatorId;
    this.namespacePrefix = payload.namespacePrefix;
    this.contextClubId = payload.contextClubId;
    this.ownerPlayerId = payload.ownerPlayerId;
    this.coOwnerPlayerIds = payload.coOwnerPlayerIds ?? [];
    this.editorPlayerIds = payload.editorPlayerIds ?? [];
    this.note = payload.note;
    this.reviewDueAt = payload.reviewDueAt;
  }
}
