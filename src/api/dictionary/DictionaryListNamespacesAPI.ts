import { APIMessage } from '@/system/api';
import type {
  DictionaryListNamespacesQuery,
  DictionaryNamespaceRegistration,
  ListEnvelope,
} from '@/objects';

export class DictionaryListNamespacesAPI extends APIMessage<ListEnvelope<DictionaryNamespaceRegistration>> {
  readonly query: DictionaryListNamespacesQuery;

  constructor(filters: DictionaryListNamespacesQuery) {
    super();
    this.query = filters;
  }
}
