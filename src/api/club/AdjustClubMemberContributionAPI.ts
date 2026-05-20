import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { AdjustClubMemberContributionRequest, Club } from '@/objects/club';

export class AdjustClubMemberContributionAPI extends APIMessage<Club> {
  readonly operatorId: string;
  readonly playerId: string;
  readonly delta: number;
  readonly note: string[];

  constructor(
    readonly clubId: string,
    payload: AdjustClubMemberContributionRequest,
  ) {
    super();
    this.operatorId = payload.operatorId;
    this.playerId = payload.playerId;
    this.delta = payload.delta;
    this.note = encodeBackendOption(payload.note);
  }
}
