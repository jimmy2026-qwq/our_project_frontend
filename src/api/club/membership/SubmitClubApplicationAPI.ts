import { APIMessage } from '@/system/api';
import type { ClubMembershipApplicationResponse, ClubMembershipApplicationRequest } from '@/objects/club';

export class SubmitClubApplicationAPI extends APIMessage<ClubMembershipApplicationResponse> {
  readonly request: ClubMembershipApplicationRequest;

  constructor(
    readonly clubId: string,
    payload: ClubMembershipApplicationRequest,
  ) {
    super();
    this.request = {
      ...payload,
      displayName: payload.displayName ?? '',
    };
  }
}
