import type { PlayerProfileView, PlayerStatus } from '@/objects/player';
import type { PlayerProfile } from '@/pages/objects/PlayerProfile';

function toPlayerClubIds(item: PlayerProfileView): string[] {
  return Array.from(
    new Set([
      ...(item.clubId ? [item.clubId] : []),
      ...(item.affiliatedClubIds ?? []),
    ]),
  );
}

function toPlayerStatus(status: PlayerStatus): PlayerProfile['playerStatus'] {
  return status === 'Suspended' ? 'Inactive' : status;
}

export function toPlayerProfile(item: PlayerProfileView): PlayerProfile {
  return {
    playerId: item.playerId,
    applicantUserId: item.userId,
    displayName: item.nickname,
    playerStatus: toPlayerStatus(item.status),
    currentRank: item.currentRank,
    elo: item.elo,
    clubIds: toPlayerClubIds(item),
  };
}

export { toPlayerStatus };
