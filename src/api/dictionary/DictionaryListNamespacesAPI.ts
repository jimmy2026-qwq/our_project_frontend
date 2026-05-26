import { APIMessage } from '@/system/api';
import type {
  DictionaryListNamespacesQuery,
  DictionaryNamespaceRegistrationView,
  ListEnvelope,
} from '@/objects';

export class DictionaryListNamespacesAPI extends APIMessage<ListEnvelope<DictionaryNamespaceRegistrationView>> {
  readonly query: DictionaryListNamespacesQuery;

  constructor(filters: DictionaryListNamespacesQuery) {
    super();
    this.query = filters;
  }
}
