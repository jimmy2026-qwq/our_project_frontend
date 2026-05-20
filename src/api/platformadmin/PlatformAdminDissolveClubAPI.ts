import { APIMessage } from '@/system/api';
import type {
  DissolveClubRequest,
  PlatformAdminClubResponse,
} from '@/objects/platformadmin';

export class PlatformAdminDissolveClubAPI extends APIMessage<PlatformAdminClubResponse> {
  readonly clubId: string;
  readonly operatorId: string;

  constructor(clubId: string, payload: DissolveClubRequest) {
    super();
    this.clubId = clubId;
    this.operatorId = payload.operatorId;
  }
}
