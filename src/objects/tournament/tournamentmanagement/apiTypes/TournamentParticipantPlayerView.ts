import type { PlayerStatus } from '@/objects/player';
import type { RankSnapshotView } from '../../rulesmanagement/ranking/apiTypes/RankSnapshotView';

export interface TournamentParticipantPlayerView {
  playerId: string;
  nickname: string;
  status: PlayerStatus;
  elo: number;
  currentRank: RankSnapshotView;
  clubIds: string[];
}
