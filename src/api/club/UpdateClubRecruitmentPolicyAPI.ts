import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { Club, UpdateClubRecruitmentPolicyRequest } from '@/objects/club';

export class UpdateClubRecruitmentPolicyAPI extends APIMessage<Club> {
  readonly operatorId: string;
  readonly applicationsOpen: boolean;
  readonly requirementsText: string[];
  readonly expectedReviewSlaHours: number[];
  readonly note: string[];

  constructor(
    readonly clubId: string,
    payload: UpdateClubRecruitmentPolicyRequest,
  ) {
    super();
    this.operatorId = payload.operatorId;
    this.applicationsOpen = payload.applicationsOpen;
    this.requirementsText = encodeBackendOption(payload.requirementsText);
    this.expectedReviewSlaHours = encodeBackendOption(payload.expectedReviewSlaHours);
    this.note = encodeBackendOption(payload.note);
  }
}
