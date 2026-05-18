import { toQueryString } from '@/lib/query';
import { request, sendJson } from '../shared/http';
import { mapPlayerProfile } from './mappers';
import type { CreatePlayerPayload, CreatedPlayerContract, PlayerProfileContract } from '@/objects/player';
import { buildCreatePlayerRequest } from './transport';

export const playerApi = {
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
