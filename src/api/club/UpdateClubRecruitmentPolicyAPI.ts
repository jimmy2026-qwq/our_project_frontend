import { APIMessage } from '@/system/api';
import type { ClubView, UpdateClubRecruitmentPolicyRequest } from '@/objects/club';

export class UpdateClubRecruitmentPolicyAPI extends APIMessage<ClubView> {
  readonly request: UpdateClubRecruitmentPolicyRequest;

  constructor(
    readonly clubId: string,
    payload: UpdateClubRecruitmentPolicyRequest,
  ) {
    super();
    this.request = payload;
  }
}
