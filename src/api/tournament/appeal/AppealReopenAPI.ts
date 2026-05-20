import { APIMessage } from '@/system/api';
import type { AppealTicketView } from '@/objects/tournament/appeal';

export class AppealReopenAPI extends APIMessage<AppealTicketView> {
  readonly appealId: string;
  readonly operatorId: string;
  readonly reason: string;
  readonly note?: string;

  constructor(appealId: string, operatorId: string, reason: string, note?: string) {
    super();
    this.appealId = appealId;
    this.operatorId = operatorId;
    this.reason = reason;
    this.note = note;
  }
}
