import type { PlayerProfile } from '@/pages/objects/PlayerProfile';

import type { PlayerProfileView } from '@/objects/player';

export interface CreatedPlayerView {
  id: string;
  userId: string;
  nickname: string;
  elo: number;
}

export function mapPlayerProfile(item: PlayerProfileView): PlayerProfile {
  return {
    playerId: item.playerId,
    applicantUserId: item.userId,
    displayName: item.nickname,
    playerStatus: item.status,
    currentRank: item.currentRank,
    elo: item.elo,
    clubIds: item.affiliatedClubIds,
  };
}

export function mapCreatedPlayerView(item: PlayerProfileView) {
  return {
    id: item.playerId,
    userId: item.userId,
    nickname: item.nickname,
    elo: item.elo,
  };
}
