import type { AppealDecisionType } from './AppealDecisionType';
import type { AppealTableResolution } from './AppealTableResolution';

export interface AdjudicateAppealRequest {
  operatorId: string;
  decision: AppealDecisionType;
  verdict: string;
  tableResolution?: AppealTableResolution;
  note?: string;
}

