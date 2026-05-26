import { APIMessage } from '@/system/api';
import type {
  ClubContributionAuditEntry,
  ClubContributionAuditQuery,
  ListEnvelope,
} from '@/objects';

export type ListClubContributionAuditsAPIRequest = ClubContributionAuditQuery;

export class ListClubContributionAuditsAPI extends APIMessage<ListEnvelope<ClubContributionAuditEntry>> {
  readonly query: ClubContributionAuditQuery;

  constructor(
    readonly clubId: string,
    payload: ListClubContributionAuditsAPIRequest,
  ) {
    super();
    this.query = payload;
  }
}
