import { APIMessage } from '@/system/api';
import type { AppealTicketView } from '@/objects/tournament/appeal';

export class AppealResolveAPI extends APIMessage<AppealTicketView> {
  readonly appealId: string;
  readonly operatorId: string;
  readonly verdict: string;
  readonly note?: string;

  constructor(appealId: string, operatorId: string, verdict: string, note?: string) {
    super();
    this.appealId = appealId;
    this.operatorId = operatorId;
    this.verdict = verdict;
    this.note = note;
  }
}
