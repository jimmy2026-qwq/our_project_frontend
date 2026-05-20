import { APIMessage } from '@/system/api';
import type {
  DictionaryListNamespacesQuery,
  DictionaryNamespaceRegistration,
  ListEnvelope,
} from '@/objects';

export class DictionaryListNamespacesAPI extends APIMessage<ListEnvelope<DictionaryNamespaceRegistration>> {
  readonly operatorId: string;
  readonly status?: string;
  readonly contextClubId?: string;
  readonly ownerId?: string;
  readonly requestedBy?: string;
  readonly reviewedBy?: string;
  readonly asOf?: string;
  readonly overdueOnly?: boolean;
  readonly dueBefore?: string;
  readonly dueAfter?: string;
  readonly limit?: number;
  readonly offset?: number;

  constructor(filters: DictionaryListNamespacesQuery) {
    super();
    this.operatorId = filters.operatorId;
    this.status = filters.status;
    this.contextClubId = filters.contextClubId;
    this.ownerId = filters.ownerId;
    this.requestedBy = filters.requestedBy;
    this.reviewedBy = filters.reviewedBy;
    this.asOf = filters.asOf;
    this.overdueOnly = filters.overdueOnly;
    this.dueBefore = filters.dueBefore;
    this.dueAfter = filters.dueAfter;
    this.limit = filters.limit;
    this.offset = filters.offset;
  }
}
