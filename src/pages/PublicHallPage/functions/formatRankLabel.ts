import type { PublicHallRankSnapshot } from '../objects/PublicHallPage.types';

export function formatRankLabel(rank?: PublicHallRankSnapshot | null) {
  if (!rank) {
    return null;
  }

  return rank.stars
    ? `${rank.platform} ${rank.tier} ${rank.stars}`
    : `${rank.platform} ${rank.tier}`;
}
