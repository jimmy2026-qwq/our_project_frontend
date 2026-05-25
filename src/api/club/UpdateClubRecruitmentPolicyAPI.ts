import { APIMessage } from '@/system/api';
import type { Club, UpdateClubRecruitmentPolicyRequest } from '@/objects/club';

export class UpdateClubRecruitmentPolicyAPI extends APIMessage<Club> {
  readonly request: UpdateClubRecruitmentPolicyRequest;

  constructor(
    readonly clubId: string,
    payload: UpdateClubRecruitmentPolicyRequest,
  ) {
    super();
    this.request = payload;
  }
}
