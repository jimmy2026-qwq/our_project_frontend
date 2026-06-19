import type { PlayerCurrentRank } from './PlayerCurrentRank';

export interface PlayerProfile {
  playerId: string;
  displayName: string;
  playerStatus?: 'Active' | 'Inactive' | 'Banned';
  currentRank?: PlayerCurrentRank | null;
  elo?: number;
  clubIds?: string[];
}
