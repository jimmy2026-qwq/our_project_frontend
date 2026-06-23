import { APIMessage } from '@/system/api';
import type { TournamentTableView, UploadPaifuRequest } from '@/objects';

export class TournamentTableUploadPaifuAPI extends APIMessage<TournamentTableView> {
  readonly tableId: string;
  readonly request: UploadPaifuRequest;

  constructor(tableId: string, request: UploadPaifuRequest) {
    super();
    this.tableId = tableId;
    this.request = request;
  }
}
