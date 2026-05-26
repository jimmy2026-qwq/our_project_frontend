export const RankPlatforms = {
  Tenhou: 'Tenhou',
  MahjongSoul: 'MahjongSoul',
  Custom: 'Custom',
} as const;

export type RankPlatform = (typeof RankPlatforms)[keyof typeof RankPlatforms];
