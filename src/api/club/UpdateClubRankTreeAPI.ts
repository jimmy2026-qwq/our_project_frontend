import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { Club, ClubRankNodeRequest, UpdateClubRankTreeRequest } from '@/objects/club';

export class UpdateClubRankTreeAPI extends APIMessage<Club> {
  readonly operatorId: string;
  readonly ranks: ClubRankNodeRequest[];
  readonly note: string[];

  constructor(
    readonly clubId: string,
    payload: UpdateClubRankTreeRequest,
  ) {
    super();
    this.operatorId = payload.operatorId;
    this.ranks = payload.ranks;
    this.note = encodeBackendOption(payload.note);
  }
}
