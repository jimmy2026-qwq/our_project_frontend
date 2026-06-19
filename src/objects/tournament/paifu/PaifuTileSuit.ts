export enum PaifuTileSuit {
  Manzu = 'm',
  Pinzu = 'p',
  Souzu = 's',
  Honor = 'z',
}

export type NumberedPaifuTileSuit =
  | PaifuTileSuit.Manzu
  | PaifuTileSuit.Pinzu
  | PaifuTileSuit.Souzu;

export function isPaifuTileSuit(value: unknown): value is PaifuTileSuit {
  return (
    value === PaifuTileSuit.Manzu ||
    value === PaifuTileSuit.Pinzu ||
    value === PaifuTileSuit.Souzu ||
    value === PaifuTileSuit.Honor
  );
}
