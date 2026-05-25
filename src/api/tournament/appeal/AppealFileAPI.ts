import { APIMessage } from '@/system/api';
import type { AppealTicketView, FileAppealRequest } from '@/objects/tournament/appeal';

export class AppealFileAPI extends APIMessage<AppealTicketView> {
  readonly tableId: string;
  readonly request: FileAppealRequest;

  constructor(tableId: string, payload: FileAppealRequest) {
    super();
    this.tableId = tableId;
    this.request = {
      ...payload,
      attachments: payload.attachments ?? [],
    };
  }
}
