export const MahjongMeldTypes = {
  Chi: 'Chi',
  Pon: 'Pon',
  OpenKan: 'OpenKan',
  ClosedKan: 'ClosedKan',
  AddedKan: 'AddedKan',
} as const;

export type MahjongMeldType =
  (typeof MahjongMeldTypes)[keyof typeof MahjongMeldTypes];
