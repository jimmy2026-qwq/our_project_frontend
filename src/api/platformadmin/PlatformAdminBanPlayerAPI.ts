import { APIMessage } from '@/system/api';
import type {
  BanPlayerRequest,
  PlatformAdminPlayerView,
} from '@/objects/platformadmin';

export class PlatformAdminBanPlayerAPI extends APIMessage<PlatformAdminPlayerView> {
  readonly playerId: string;
  readonly operatorId: string;
  readonly reason: string;

  constructor(playerId: string, payload: BanPlayerRequest) {
    super();
    this.playerId = playerId;
    this.operatorId = payload.operatorId;
    this.reason = payload.reason;
  }
}
