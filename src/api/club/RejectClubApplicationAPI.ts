import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { Club, RejectClubApplicationRequest } from '@/objects/club';

export class RejectClubApplicationAPI extends APIMessage<Club> {
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
