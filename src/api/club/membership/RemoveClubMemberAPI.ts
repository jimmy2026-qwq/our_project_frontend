import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { ClubView, RemoveClubMemberRequest } from '@/objects/club';

export class RemoveClubMemberAPI extends APIMessage<ClubView> {
  readonly operatorId: string[];

  constructor(
    readonly clubId: string,
    readonly playerId: string,
    payload: RemoveClubMemberRequest = {},
  ) {
    super();
    this.operatorId = encodeBackendOption(payload.operatorId);
  }
}
