import { APIMessage } from '@/system/api';
import type { ClubMembershipApplication, ClubMembershipApplicationRequest } from '@/objects/club';

export class SubmitClubApplicationAPI extends APIMessage<ClubMembershipApplication> {
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
