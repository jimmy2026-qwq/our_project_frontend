import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { ClubApplicationDetailQuery, ClubMembershipApplicationView } from '@/objects';

export class GetClubApplicationAPI extends APIMessage<ClubMembershipApplicationView> {
  readonly operatorId: string[];
  readonly guestSessionId: string[];

  constructor(
    readonly clubId: string,
    readonly membershipId: string,
    filters: ClubApplicationDetailQuery,
  ) {
    super();
    this.operatorId = encodeBackendOption(filters.operatorId);
    this.guestSessionId = encodeBackendOption(filters.guestSessionId);
  }
}
