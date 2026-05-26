import { APIMessage } from '@/system/api';
import type { AssignClubAdminRequest, ClubView } from '@/objects/club';

export class AssignClubAdminAPI extends APIMessage<ClubView> {
  readonly playerId: string;
  readonly operatorId: string;

  constructor(
    readonly clubId: string,
    payload: AssignClubAdminRequest,
  ) {
    super();
    this.playerId = payload.playerId;
    this.operatorId = payload.operatorId;
  }
}
