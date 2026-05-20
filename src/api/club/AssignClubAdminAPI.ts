import { APIMessage } from '@/system/api';
import type { AssignClubAdminRequest, Club } from '@/objects/club';

export class AssignClubAdminAPI extends APIMessage<Club> {
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
