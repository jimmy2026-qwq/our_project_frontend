import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { ClubMembershipApplicationResponse, WithdrawClubApplicationRequest } from '@/objects/club';

export class WithdrawClubApplicationAPI extends APIMessage<ClubMembershipApplicationResponse> {
  readonly operatorId: string[];
  readonly note: string[];

  constructor(
    readonly clubId: string,
    readonly membershipId: string,
    payload: WithdrawClubApplicationRequest = {},
  ) {
    super();
    this.operatorId = encodeBackendOption(payload.operatorId);
    this.note = encodeBackendOption(payload.note);
  }
}
