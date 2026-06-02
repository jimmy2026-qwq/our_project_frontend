import { APIMessage } from '@/system/api';
import type { MahjongTableQuery, MahjongTableView } from '@/objects';

export class MahjongCoreGetTableAPI extends APIMessage<MahjongTableView> {
  readonly tableId: string;
  readonly query: MahjongTableQuery;

  constructor(tableId: string, query: MahjongTableQuery = {}) {
    super();
    this.tableId = tableId;
    this.query = query;
  }
}
