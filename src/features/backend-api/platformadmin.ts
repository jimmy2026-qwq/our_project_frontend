import type {
  BanPlayerRequest,
  DissolveClubRequest,
  GrantSuperAdminRequest,
  PlatformAdminClubView,
  PlatformAdminPlayerView,
} from '@/objects/platformadmin';
import { sendAPI } from '@/system/api';

import { PlatformAdminBanPlayerAPI } from '@/api/platformadmin/PlatformAdminBanPlayerAPI';
import { PlatformAdminDissolveClubAPI } from '@/api/platformadmin/PlatformAdminDissolveClubAPI';
import { PlatformAdminGrantSuperAdminAPI } from '@/api/platformadmin/PlatformAdminGrantSuperAdminAPI';


export const platformAdminApi = {
  banPlayer(playerId: string, payload: BanPlayerRequest) {
    return sendAPI<PlatformAdminPlayerView>(
      new PlatformAdminBanPlayerAPI(playerId, payload),
    );
  },
  dissolveClub(clubId: string, payload: DissolveClubRequest) {
    return sendAPI<PlatformAdminClubView>(
      new PlatformAdminDissolveClubAPI(clubId, payload),
    );
  },
  grantSuperAdmin(playerId: string, payload: GrantSuperAdminRequest) {
    return sendAPI<PlatformAdminPlayerView>(
      new PlatformAdminGrantSuperAdminAPI(playerId, payload),
    );
  },
};
