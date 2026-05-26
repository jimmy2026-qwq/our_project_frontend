import type { RankPlatform } from './RankPlatform';

export interface RankSnapshot {
  platform: RankPlatform;
  tier: string;
  stars: number | null;
}
