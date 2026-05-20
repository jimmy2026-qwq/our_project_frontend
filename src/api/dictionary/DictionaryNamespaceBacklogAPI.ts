import { APIMessage } from '@/system/api';
import type {
  DictionaryNamespaceBacklogView,
  DictionaryNamespaceBacklogQuery,
} from '@/objects/dictionary';

export class DictionaryNamespaceBacklogAPI extends APIMessage<DictionaryNamespaceBacklogView> {
  readonly operatorId: string;
  readonly asOf?: string;
  readonly dueSoonHours?: number;

  constructor(filters: DictionaryNamespaceBacklogQuery) {
    super();
    this.operatorId = filters.operatorId;
    this.asOf = filters.asOf;
    this.dueSoonHours = filters.dueSoonHours;
  }
}
