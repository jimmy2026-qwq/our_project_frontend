import type { AppealDecisionLogAction } from './AppealDecisionLogAction';
import type { AppealPriority } from './AppealPriority';

export interface AppealDecisionLog {
  operatorId: string;
  action: AppealDecisionLogAction;
  decidedAt: string;
  targetPlayerId: string | null;
  priority: AppealPriority | null;
  dueAt: string | null;
  detail: string | null;
  note: string | null;
}
