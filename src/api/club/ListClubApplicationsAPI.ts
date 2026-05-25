import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { ClubApplicationListQuery, ClubMembershipApplicationView, ListEnvelope } from '@/objects';
import type { ClubApplicationStatus } from '@/objects/club';
import type { BackendOption } from '@/system/api/backend-option.transport';

export class ListClubApplicationsAPI extends APIMessage<ListEnvelope<ClubMembershipApplicationView>> {
  readonly operatorId: string[];
  readonly guestSessionId: string[];
  readonly status: BackendOption<ClubApplicationStatus>;
  readonly applicantUserId: string[];
  readonly displayName: string[];
  readonly limit: number[];
  readonly offset: number[];

  constructor(
    readonly clubId: string,
    filters: ClubApplicationListQuery,
  ) {
    super();
    this.operatorId = encodeBackendOption(filters.operatorId);
    this.guestSessionId = encodeBackendOption(filters.guestSessionId);
    this.status = encodeBackendOption(filters.status);
    this.applicantUserId = encodeBackendOption(filters.applicantUserId);
    this.displayName = encodeBackendOption(filters.displayName);
    this.limit = encodeBackendOption(filters.limit);
    this.offset = encodeBackendOption(filters.offset);
  }
}
