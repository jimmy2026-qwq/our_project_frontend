import { APIMessage } from '@/system/api';
import type {
  GrantSuperAdminRequest,
  PlatformAdminPlayerResponse,
} from '@/objects/platformadmin';

export class PlatformAdminGrantSuperAdminAPI extends APIMessage<PlatformAdminPlayerResponse> {
  readonly playerId: string;
  readonly operatorId: string;

  constructor(playerId: string, payload: GrantSuperAdminRequest) {
    super();
    this.playerId = playerId;
    this.operatorId = payload.operatorId;
  }
}
