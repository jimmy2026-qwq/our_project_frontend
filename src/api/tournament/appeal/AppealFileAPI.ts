import { APIMessage } from '@/system/api';
import type { AppealPriority, AppealTicketView, FileAppealRequest } from '@/objects/tournament/appeal';
import { encodeBackendOption } from '@/system/api/backend-option.transport';
import type { BackendOption } from '@/system/api/backend-option.transport';

export class AppealFileAPI extends APIMessage<AppealTicketView> {
  readonly tableId: string;
  readonly playerId: string;
  readonly description: string;
  readonly attachments: NonNullable<FileAppealRequest['attachments']>;
  readonly priority: BackendOption<AppealPriority>;
  readonly dueAt: BackendOption<string>;

  constructor(tableId: string, payload: FileAppealRequest) {
    super();
    this.tableId = tableId;
    this.playerId = payload.playerId;
    this.description = payload.description;
    this.attachments = payload.attachments ?? [];
    this.priority = encodeBackendOption(payload.priority);
    this.dueAt = encodeBackendOption(payload.dueAt);
  }
}
