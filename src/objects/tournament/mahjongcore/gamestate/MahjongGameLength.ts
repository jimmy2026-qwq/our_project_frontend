export const MahjongGameLengths = {
  OneKyoku: 'OneKyoku',
  Tonpu: 'Tonpu',
  Hanchan: 'Hanchan',
} as const;

export type MahjongGameLength =
  (typeof MahjongGameLengths)[keyof typeof MahjongGameLengths];
