export interface AdjudicateAppealPayload {
  operatorId: string;
  decision: 'Resolve' | 'Reject' | 'Escalate';
  verdict: string;
  tableResolution?: 'RestorePriorState' | 'ContinueCurrentState' | 'ArchiveTable' | 'ForceResetTable';
  note?: string;
}

export interface UpdateAppealWorkflowPayload {
  operatorId: string;
  assigneeId?: string;
  clearAssignee?: boolean;
  priority?: string;
  dueAt?: string;
  clearDueAt?: boolean;
  note?: string;
}
