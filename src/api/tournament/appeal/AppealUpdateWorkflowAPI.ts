import { APIMessage } from '@/system/api';
import type {
  AppealTicketView,
  UpdateAppealWorkflowRequest,
} from '@/objects/tournament/appeal';

export class AppealUpdateWorkflowAPI extends APIMessage<AppealTicketView> {
  readonly appealId: string;
  readonly request: UpdateAppealWorkflowRequest;

  constructor(appealId: string, payload: UpdateAppealWorkflowRequest) {
    super();
    this.appealId = appealId;
    this.request = {
      ...payload,
      clearAssignee: payload.clearAssignee ?? false,
      clearDueAt: payload.clearDueAt ?? false,
    };
  }
}
