import type { PlayerStatus } from '@/objects/player';

import type { PlayerCurrentRank } from './PlayerCurrentRank';

export interface PlayerProfile {
  playerId: string;
  displayName: string;
  playerStatus?: PlayerStatus;
  currentRank?: PlayerCurrentRank | null;
  elo?: number;
  clubIds?: string[];
}
