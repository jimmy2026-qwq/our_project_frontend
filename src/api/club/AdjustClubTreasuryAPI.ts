import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { AdjustClubTreasuryRequest, Club } from '@/objects/club';

export class AdjustClubTreasuryAPI extends APIMessage<Club> {
  readonly operatorId: string;
  readonly delta: number;
  readonly note: string[];

  constructor(
    readonly clubId: string,
    payload: AdjustClubTreasuryRequest,
  ) {
    super();
    this.operatorId = payload.operatorId;
    this.delta = payload.delta;
    this.note = encodeBackendOption(payload.note);
  }
}
