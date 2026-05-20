import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { Club, RemoveClubMemberRequest } from '@/objects/club';

export class RemoveClubMemberAPI extends APIMessage<Club> {
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
