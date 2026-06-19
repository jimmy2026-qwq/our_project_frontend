import { isPaifuTileSuit, type PaifuTileSuit } from './PaifuTileSuit';

export interface PaifuTile {
  rank: number;
  suit: PaifuTileSuit;
}

export type PaifuTileInput = PaifuTile | string;

export function getPaifuTileCode(tile: PaifuTileInput) {
  const normalized = typeof tile === 'string' ? toPaifuTile(tile) : tile;

  return `${normalized.rank}${normalized.suit}`;
}

export function isPaifuTile(value: unknown): value is PaifuTile {
  return (
    Boolean(value) &&
    typeof value === 'object' &&
    typeof (value as PaifuTile).rank === 'number' &&
    isPaifuTileSuit((value as PaifuTile).suit)
  );
}

export function isSamePaifuTile(left: PaifuTileInput, right: PaifuTileInput) {
  return getPaifuTileCode(left) === getPaifuTileCode(right);
}

export function toPaifuTile(tile: PaifuTileInput): PaifuTile {
  if (typeof tile !== 'string') {
    return tile;
  }

  const normalized = tile.trim().toLowerCase();
  if (normalized.length !== 2) {
    throw new Error(`Invalid paifu tile: ${tile}`);
  }

  const rank = Number(normalized[0]);
  const suit = normalized[1];
  if (!Number.isInteger(rank) || !isPaifuTileSuit(suit)) {
    throw new Error(`Invalid paifu tile: ${tile}`);
  }

  return { rank, suit };
}
