export const MahjongCommandTypes = {
  Discard: 'Discard',
  Chi: 'Chi',
  Pon: 'Pon',
  OpenKan: 'OpenKan',
  ClosedKan: 'ClosedKan',
  AddedKan: 'AddedKan',
  Riichi: 'Riichi',
  Ron: 'Ron',
  Tsumo: 'Tsumo',
  Pass: 'Pass',
  AbortiveDraw: 'AbortiveDraw',
} as const;

export type MahjongCommandType =
  (typeof MahjongCommandTypes)[keyof typeof MahjongCommandTypes];
