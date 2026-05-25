import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type {
  ClubApplicationReviewDecision,
  ClubMembershipApplicationView,
  ReviewClubApplicationRequest,
} from '@/objects/club';

export class ReviewClubApplicationAPI extends APIMessage<ClubMembershipApplicationView> {
  readonly operatorId: string;
  readonly decision: ClubApplicationReviewDecision;
  readonly playerId: string[];
  readonly note: string[];

  constructor(
    readonly clubId: string,
    readonly membershipId: string,
    payload: ReviewClubApplicationRequest,
  ) {
    super();
    this.operatorId = payload.operatorId;
    this.decision = payload.decision;
    this.playerId = encodeBackendOption(payload.playerId);
    this.note = encodeBackendOption(payload.note);
  }
}
