import { APIMessage } from '@/system/api';
import type { ClubMemberPrivilegeSnapshotView } from '@/objects/club';

export class GetClubMemberPrivilegeAPI extends APIMessage<ClubMemberPrivilegeSnapshotView> {
  constructor(
    readonly clubId: string,
    readonly playerId: string,
  ) {
    super();
  }
}
