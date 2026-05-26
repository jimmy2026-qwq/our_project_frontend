import { APIMessage } from '@/system/api';
import type {
  GrantSuperAdminRequest,
  PlatformAdminPlayerView,
} from '@/objects/platformadmin';

export class PlatformAdminGrantSuperAdminAPI extends APIMessage<PlatformAdminPlayerView> {
  readonly playerId: string;
  readonly operatorId: string;

  constructor(playerId: string, payload: GrantSuperAdminRequest) {
    super();
    this.playerId = playerId;
    this.operatorId = payload.operatorId;
  }
}
