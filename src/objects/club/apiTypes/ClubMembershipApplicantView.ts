import type { PlayerStatus } from '@/objects/player';
import type { RankSnapshotView } from '@/objects/tournament';

export interface ClubMembershipApplicantView {
  playerId: string | null;
  applicantUserId: string | null;
  displayName: string;
  playerStatus: PlayerStatus | null;
  currentRank: RankSnapshotView | null;
  elo: number | null;
  clubIds: string[];
}
