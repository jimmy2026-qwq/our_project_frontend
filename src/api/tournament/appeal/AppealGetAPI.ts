import { APIMessage } from '@/system/api';
import type { AppealTicketView } from '@/objects/tournament/appeal';

export class AppealGetAPI extends APIMessage<AppealTicketView> {
  readonly appealId: string;

  constructor(appealId: string) {
    super();
    this.appealId = appealId;
  }
}
