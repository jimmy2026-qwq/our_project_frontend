import { encodeBackendOption } from './backend-option.transport';
import type {
  AdjudicateAppealPayload,
  UpdateAppealWorkflowPayload,
} from './appeals';

export function buildAdjudicateAppealRequest(payload: AdjudicateAppealPayload) {
  return {
    operatorId: payload.operatorId,
    decision: payload.decision,
    verdict: payload.verdict,
    tableResolution: encodeBackendOption(payload.tableResolution),
    note: encodeBackendOption(payload.note),
  };
}

export function buildUpdateAppealWorkflowRequest(payload: UpdateAppealWorkflowPayload) {
  return {
    operatorId: payload.operatorId,
    assigneeId: encodeBackendOption(payload.assigneeId),
    clearAssignee: payload.clearAssignee ?? false,
    priority: encodeBackendOption(payload.priority),
    dueAt: encodeBackendOption(payload.dueAt),
    clearDueAt: payload.clearDueAt ?? false,
    note: encodeBackendOption(payload.note),
  };
}
