import type { RankPlatform } from '@/objects/player';

export interface RankSnapshotView {
  platform: RankPlatform;
  tier: string;
  stars: number | null;
}
