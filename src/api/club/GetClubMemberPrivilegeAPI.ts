import { APIMessage } from '@/system/api';
import type { ClubMemberPrivilegeSnapshot } from '@/objects/club';

export class GetClubMemberPrivilegeAPI extends APIMessage<ClubMemberPrivilegeSnapshot> {
  constructor(
    readonly clubId: string,
    readonly playerId: string,
  ) {
    super();
  }
}
