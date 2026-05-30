import type { RankSnapshotView } from '@/objects/tournament';
import type { PlayerStatus } from '../PlayerStatus';
import type { PlayerRoleFlagsView } from './PlayerRoleFlagsView';

export interface PlayerProfileView {
  playerId: string;
  userId: string;
  nickname: string;
  registeredAt: string;
  currentRank: RankSnapshotView;
  status: PlayerStatus;
  elo: number;
  clubId: string | null;
  affiliatedClubIds: string[];
  roles: PlayerRoleFlagsView;
  bannedReason: string | null;
}
