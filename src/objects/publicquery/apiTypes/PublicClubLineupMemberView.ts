import type { PlayerStatus } from '@/objects/player';
import type { RankSnapshotView } from '@/objects/tournament';

export interface PublicClubLineupMemberView {
  playerId: string;
  nickname: string;
  elo: number;
  currentRank: RankSnapshotView;
  status: PlayerStatus;
  isAdmin: boolean;
  internalTitle: string | null;
  privileges: string[];
}
