import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { ClearClubTitleRequest, ClubView } from '@/objects/club';

export class ClearClubTitleAPI extends APIMessage<ClubView> {
  readonly operatorId: string;
  readonly note: string[];

  constructor(
    readonly clubId: string,
    readonly playerId: string,
    payload: ClearClubTitleRequest,
  ) {
    super();
    this.operatorId = payload.operatorId;
    this.note = encodeBackendOption(payload.note);
  }
}
