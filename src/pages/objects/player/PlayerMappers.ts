import type { PlayerProfile } from './PlayerProfile';

import type { PlayerProfileView } from '@/objects/player';

export interface CreatedPlayerView {
  id: string;
  userId: string;
  nickname: string;
  elo: number;
}

export function mapPlayerClubIds(item: PlayerProfileView): string[] {
  return Array.from(
    new Set([
      ...(item.clubId ? [item.clubId] : []),
      ...(item.affiliatedClubIds ?? []),
    ]),
  );
}

export function mapPlayerProfile(item: PlayerProfileView): PlayerProfile {
  return {
    playerId: item.playerId,
    applicantUserId: item.userId,
    displayName: item.nickname,
    playerStatus: item.status,
    currentRank: item.currentRank,
    elo: item.elo,
    clubIds: mapPlayerClubIds(item),
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
