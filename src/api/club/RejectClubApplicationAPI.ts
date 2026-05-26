import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { ClubView, RejectClubApplicationRequest } from '@/objects/club';

export class RejectClubApplicationAPI extends APIMessage<ClubView> {
  readonly operatorId: string;
  readonly note: string[];

  constructor(
    readonly clubId: string,
    readonly membershipId: string,
    payload: RejectClubApplicationRequest,
  ) {
    super();
    this.operatorId = payload.operatorId;
    this.note = encodeBackendOption(payload.note);
  }
}
