import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { AdjustClubPointPoolRequest, Club } from '@/objects/club';

export class AdjustClubPointPoolAPI extends APIMessage<Club> {
  readonly operatorId: string;
  readonly delta: number;
  readonly note: string[];

  constructor(
    readonly clubId: string,
    payload: AdjustClubPointPoolRequest,
  ) {
    super();
    this.operatorId = payload.operatorId;
    this.delta = payload.delta;
    this.note = encodeBackendOption(payload.note);
  }
}
