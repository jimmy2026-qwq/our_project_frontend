import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { ClubView, RevokeClubHonorRequest } from '@/objects/club';

export class RevokeClubHonorAPI extends APIMessage<ClubView> {
  readonly operatorId: string;
  readonly title: string;
  readonly note: string[];

  constructor(
    readonly clubId: string,
    payload: RevokeClubHonorRequest,
  ) {
    super();
    this.operatorId = payload.operatorId;
    this.title = payload.title;
    this.note = encodeBackendOption(payload.note);
  }
}
