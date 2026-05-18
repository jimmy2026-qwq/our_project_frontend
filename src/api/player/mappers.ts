import type { PlayerProfile } from '@/objects';
import type { PlayerProfileContract } from '@/objects/player';

export function mapPlayerProfile(item: PlayerProfileContract): PlayerProfile {
  return {
    playerId: item.id,
    applicantUserId: item.userId,
    displayName: item.nickname,
    playerStatus: item.status,
    elo: item.elo,
    clubIds: item.boundClubIds,
  };
}
