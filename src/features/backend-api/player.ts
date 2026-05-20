import type { CreatePlayerRequest, PlayerProfileView } from '@/objects/player';
import type { CreatedPlayerView } from '@/pages/objects/PlayerMappers';
import {
  mapCreatedPlayerView,
  mapPlayerProfile,
} from '@/pages/objects/PlayerMappers';
import { sendAPI } from '@/system/api';

import { CreatePlayerAPI } from '@/api/player/CreatePlayerAPI';
import { GetCurrentPlayerAPI } from '@/api/player/GetCurrentPlayerAPI';
import { GetPlayerAPI } from '@/api/player/GetPlayerAPI';


export const playerApi = {
  createPlayer(payload: CreatePlayerRequest) {
    return sendAPI<PlayerProfileView>(
      CreatePlayerAPI.fromRequest(payload),
    ).then(mapCreatedPlayerView) as Promise<CreatedPlayerView>;
  },
  getCurrentPlayer(operatorId: string) {
    return sendAPI<PlayerProfileView>(
      new GetCurrentPlayerAPI(operatorId),
    ).then(mapPlayerProfile);
  },
  getPlayer(playerId: string) {
    return sendAPI<PlayerProfileView>(new GetPlayerAPI(playerId)).then(
      mapPlayerProfile,
    );
  },
};
