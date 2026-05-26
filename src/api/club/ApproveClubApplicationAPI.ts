import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { ApproveClubApplicationRequest, ClubView } from '@/objects/club';

export class ApproveClubApplicationAPI extends APIMessage<ClubView> {
  readonly playerId: string;
  readonly operatorId: string;
  readonly note: string[];

  constructor(
    readonly clubId: string,
    readonly membershipId: string,
    payload: ApproveClubApplicationRequest,
  ) {
    super();
    this.playerId = payload.playerId;
    this.operatorId = payload.operatorId;
    this.note = encodeBackendOption(payload.note);
  }
}
