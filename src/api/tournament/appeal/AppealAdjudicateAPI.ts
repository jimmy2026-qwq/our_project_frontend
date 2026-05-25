import { APIMessage } from '@/system/api';
import type {
  AdjudicateAppealRequest,
  AppealDecisionType,
  AppealTableResolution,
  AppealTicketView,
} from '@/objects/tournament/appeal';

export class AppealAdjudicateAPI extends APIMessage<AppealTicketView> {
  readonly appealId: string;
  readonly operatorId: string;
  readonly decision: AppealDecisionType;
  readonly verdict: string;
  readonly tableResolution?: AppealTableResolution;
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
