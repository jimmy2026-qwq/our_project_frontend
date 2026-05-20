import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { ClubMembershipApplication, ClubMembershipApplicationRequest } from '@/objects/club';

export class SubmitClubApplicationAPI extends APIMessage<ClubMembershipApplication> {
  readonly applicantUserId: string[];
  readonly displayName: string;
  readonly message: string[];
  readonly guestSessionId: string[];
  readonly operatorId: string[];

  constructor(
    readonly clubId: string,
    payload: ClubMembershipApplicationRequest,
  ) {
    super();
    this.applicantUserId = [];
    this.displayName = payload.displayName ?? '';
    this.message = encodeBackendOption(payload.message);
    this.guestSessionId = encodeBackendOption(payload.guestSessionId);
    this.operatorId = encodeBackendOption(payload.operatorId);
  }
}
