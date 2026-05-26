import { APIMessage } from '@/system/api';
import type {
  DissolveClubRequest,
  PlatformAdminClubView,
} from '@/objects/platformadmin';

export class PlatformAdminDissolveClubAPI extends APIMessage<PlatformAdminClubView> {
  readonly clubId: string;
  readonly operatorId: string;

  constructor(clubId: string, payload: DissolveClubRequest) {
    super();
    this.clubId = clubId;
    this.operatorId = payload.operatorId;
  }
}
