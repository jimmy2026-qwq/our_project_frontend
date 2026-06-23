import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { ClubApplicationDetailQuery, ClubMembershipApplicationView } from '@/objects';

export class GetCurrentClubApplicationAPI extends APIMessage<ClubMembershipApplicationView> {
  readonly operatorId: string[];

  constructor(
    readonly clubId: string,
    filters: ClubApplicationDetailQuery,
  ) {
    super();
    this.operatorId = encodeBackendOption(filters.operatorId);
  }
}
