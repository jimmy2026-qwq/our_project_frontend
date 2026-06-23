import type { PlayerStatus, RankSnapshot } from '@/objects/player';

export interface ClubMembershipApplicantView {
  playerId: string | null;
  displayName: string;
  playerStatus: PlayerStatus | null;
  currentRank: RankSnapshot | null;
  elo: number | null;
  clubIds: string[];
}
