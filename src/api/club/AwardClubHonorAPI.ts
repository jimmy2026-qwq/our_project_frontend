import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { AwardClubHonorRequest, Club } from '@/objects/club';

export class AwardClubHonorAPI extends APIMessage<Club> {
  readonly operatorId: string;
  readonly title: string;
  readonly note: string[];
  readonly achievedAt: string[];

  constructor(
    readonly clubId: string,
    payload: AwardClubHonorRequest,
  ) {
    super();
    this.operatorId = payload.operatorId;
    this.title = payload.title;
    this.note = encodeBackendOption(payload.note);
    this.achievedAt = encodeBackendOption(payload.achievedAt);
  }
}
