import type { PlayerStatus, RankSnapshot } from '@/objects/player';
import type { PlayerRoleFlagsView } from './PlayerRoleFlagsView';

export interface PlayerProfileView {
  playerId: string;
  userId: string;
  nickname: string;
  registeredAt: string;
  currentRank: RankSnapshot;
  status: PlayerStatus;
  elo: number;
  clubId: string | null;
  affiliatedClubIds: string[];
  roles: PlayerRoleFlagsView;
  bannedReason: string | null;
}
