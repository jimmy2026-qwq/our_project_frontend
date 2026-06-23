import type { ClubPrivilegeCode } from '@/objects/club';
import type { PlayerStatus, RankSnapshot } from '@/objects/player';

export interface PublicClubLineupMemberView {
  playerId: string;
  nickname: string;
  elo: number;
  currentRank: RankSnapshot;
  status: PlayerStatus;
  isAdmin: boolean;
  internalTitle: string | null;
  privileges: ClubPrivilegeCode[];
}
