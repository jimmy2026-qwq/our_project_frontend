import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { Notification } from '@/objects/notification';
import type { ClubRelationKind, SubmitClubRelationRequest } from '@/objects/club';

export class SubmitClubRelationRequestAPI extends APIMessage<Notification[]> {
  readonly operatorId: string;
  readonly targetClubId: string;
  readonly relation: ClubRelationKind;
  readonly note: string[];

  constructor(
    readonly clubId: string,
    payload: SubmitClubRelationRequest,
  ) {
    super();
    this.operatorId = payload.operatorId;
    this.targetClubId = payload.targetClubId;
    this.relation = payload.relation;
    this.note = encodeBackendOption(payload.note);
  }
}
