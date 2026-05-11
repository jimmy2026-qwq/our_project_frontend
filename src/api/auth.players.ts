import { toQueryString } from '@/lib/query';
import type { CreatedPlayerContract, PlayerProfileContract } from './contracts/auth';
import { request, sendJson } from './http';
import {
  buildCreatePlayerRequest,
} from './auth.transport';
import {
  type CreatePlayerPayload,
  mapPlayerProfile,
} from './auth.shared';

export const authPlayersApi = {
  createPlayer(payload: CreatePlayerPayload) {
    return sendJson<CreatedPlayerContract>('/players', 'POST', buildCreatePlayerRequest(payload));
  },
  getCurrentPlayer(operatorId: string) {
    return request<PlayerProfileContract>(`/players/me${toQueryString({ operatorId })}`).then(
      mapPlayerProfile,
    );
  },
  getPlayer(playerId: string) {
    return request<PlayerProfileContract>(`/players/${playerId}`).then(mapPlayerProfile);
  },
};
