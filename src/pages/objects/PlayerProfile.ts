export interface PlayerProfile {
  playerId: string;
  applicantUserId?: string;
  displayName: string;
  playerStatus?: 'Active' | 'Inactive' | 'Banned';
  currentRank?: {
    platform: string;
    tier: string;
    stars?: number | null;
  } | null;
  elo?: number;
  clubIds?: string[];
}
