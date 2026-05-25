import { APIMessage } from '@/system/api';
import type {
  AdjudicateAppealRequest,
  AppealTicketView,
} from '@/objects/tournament/appeal';

export class AppealAdjudicateAPI extends APIMessage<AppealTicketView> {
  readonly appealId: string;
  readonly request: AdjudicateAppealRequest;

  constructor(appealId: string, payload: AdjudicateAppealRequest) {
    super();
    this.appealId = appealId;
    this.request = payload;
  }
}
