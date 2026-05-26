import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { AssignClubTitleRequest, ClubView } from '@/objects/club';

export class AssignClubTitleAPI extends APIMessage<ClubView> {
  readonly playerId: string;
  readonly operatorId: string;
  readonly title: string;
  readonly note: string[];

  constructor(
    readonly clubId: string,
    payload: AssignClubTitleRequest,
  ) {
    super();
    this.playerId = payload.playerId;
    this.operatorId = payload.operatorId;
    this.title = payload.title;
    this.note = encodeBackendOption(payload.note);
  }
}
