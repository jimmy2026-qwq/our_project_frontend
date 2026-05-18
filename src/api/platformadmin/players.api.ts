import { sendJson } from '../shared/http';
import type {
  BanPlayerPayload,
  GrantSuperAdminPayload,
  PlatformAdminPlayerContract,
} from '@/objects/platformadmin';

export const platformAdminPlayersApi = {
  banPlayer(playerId: string, payload: BanPlayerPayload) {
    return sendJson<PlatformAdminPlayerContract>(
      `/admin/players/${playerId}/ban`,
      'POST',
      payload,
    );
  },
  grantSuperAdmin(playerId: string, payload: GrantSuperAdminPayload) {
    return sendJson<PlatformAdminPlayerContract>(
      `/admin/players/${playerId}/super-admin`,
      'POST',
      payload,
    );
  },
};
