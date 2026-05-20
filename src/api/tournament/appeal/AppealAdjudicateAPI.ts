import { APIMessage } from '@/system/api';
import type {
  AdjudicateAppealRequest,
  AppealTicketView,
} from '@/objects/tournament/appeal';

export class AppealAdjudicateAPI extends APIMessage<AppealTicketView> {
  readonly appealId: string;
  readonly operatorId: string;
  readonly decision: string;
  readonly verdict: string;
  readonly tableResolution?: string;
  readonly note?: string;

  constructor(appealId: string, payload: AdjudicateAppealRequest) {
    super();
    this.appealId = appealId;
    this.operatorId = payload.operatorId;
    this.decision = payload.decision;
    this.verdict = payload.verdict;
    this.tableResolution = payload.tableResolution;
    this.note = payload.note;
  }
}
