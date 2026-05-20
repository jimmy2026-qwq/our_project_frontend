import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { Club, UpdateClubRelationRequest } from '@/objects/club';

export class UpdateClubRelationAPI extends APIMessage<Club> {
  readonly operatorId: string;
  readonly targetClubId: string;
  readonly relation: string;
  readonly note: string[];

  constructor(
    readonly clubId: string,
    payload: UpdateClubRelationRequest,
  ) {
    super();
    this.operatorId = payload.operatorId;
    this.targetClubId = payload.targetClubId;
    this.relation = payload.relation;
    this.note = encodeBackendOption(payload.note);
  }
}
