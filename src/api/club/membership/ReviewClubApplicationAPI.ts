import { APIMessage } from '@/system/api';
import type {
  ClubMembershipApplicationView,
  ReviewClubApplicationRequest,
} from '@/objects/club';

export class ReviewClubApplicationAPI extends APIMessage<ClubMembershipApplicationView> {
  readonly request: ReviewClubApplicationRequest;

  constructor(
    readonly clubId: string,
    readonly membershipId: string,
    payload: ReviewClubApplicationRequest,
  ) {
    super();
    this.request = payload;
  }
}
