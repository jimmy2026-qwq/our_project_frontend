import { APIMessage } from '@/system/api';
import type {
  AppealPriority,
  AppealTicketView,
  UpdateAppealWorkflowRequest,
} from '@/objects/tournament/appeal';

export class AppealUpdateWorkflowAPI extends APIMessage<AppealTicketView> {
  readonly appealId: string;
  readonly operatorId: string;
  readonly assigneeId?: string;
  readonly clearAssignee: boolean;
  readonly priority?: AppealPriority;
  readonly dueAt?: string;
  readonly clearDueAt: boolean;
  readonly note?: string;

  constructor(appealId: string, payload: UpdateAppealWorkflowRequest) {
    super();
    this.appealId = appealId;
    this.operatorId = payload.operatorId;
    this.assigneeId = payload.assigneeId;
    this.clearAssignee = payload.clearAssignee ?? false;
    this.priority = payload.priority;
    this.dueAt = payload.dueAt;
    this.clearDueAt = payload.clearDueAt ?? false;
    this.note = payload.note;
  }
}
