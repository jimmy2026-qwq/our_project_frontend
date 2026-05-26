import type { AppealPriority } from './AppealPriority';

export interface UpdateAppealWorkflowRequest {
  operatorId: string;
  assigneeId?: string;
  clearAssignee?: boolean;
  priority?: AppealPriority;
  dueAt?: string;
  clearDueAt?: boolean;
  note?: string;
}

