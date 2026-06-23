import type { PlayerStatus, RankSnapshot } from '@/objects/player';

export interface TournamentParticipantPlayerView {
  playerId: string;
  nickname: string;
  status: PlayerStatus;
  elo: number;
  currentRank: RankSnapshot;
  clubIds: string[];
}
