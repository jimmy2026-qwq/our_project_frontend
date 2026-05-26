import type { RankSnapshot } from './RankSnapshot';
import type { PlayerStatus } from './PlayerStatus';

export interface Player {
  id: string;
  userId: string;
  nickname: string;
  registeredAt: string;
  currentRank: RankSnapshot;
  elo: number;
  clubId: string | null;
  affiliatedClubIds: string[];
  status: PlayerStatus;
  roleGrants: unknown[];
  bannedReason: string | null;
  version: number;
}
