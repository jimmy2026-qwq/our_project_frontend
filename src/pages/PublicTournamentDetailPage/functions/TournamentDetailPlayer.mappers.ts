import type { PlayerProfileView } from '@/objects/player';
import type { PlayerProfile } from '@/pages/shared_objects/player/PlayerProfile';

function toPlayerClubIds(item: PlayerProfileView): string[] {
  return Array.from(
    new Set([
      ...(item.clubId ? [item.clubId] : []),
      ...(item.affiliatedClubIds ?? []),
    ]),
  );
}

export function toPlayerProfile(item: PlayerProfileView): PlayerProfile {
  return {
    playerId: item.playerId,
    displayName: item.nickname,
    playerStatus: item.status,
    currentRank: item.currentRank,
    elo: item.elo,
    clubIds: toPlayerClubIds(item),
  };
}
