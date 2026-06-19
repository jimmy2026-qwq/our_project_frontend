import type { SeatWind } from '@/objects/tournament';

import {
  isSamePaifuTile,
  PaifuTileSuit,
  type PaifuAction,
  type PaifuTile,
} from '@/objects';
import type { MeldTile } from '../objects/ReplaySnapshot.types';
import { removeFirstMatchingTile } from './getReplaySnapshotHands';
import { getOpenMeldSidewaysIndex } from './getReplaySnapshotRelations';

export function getOpenMeldTiles({
  action,
  callerSeat,
  claimedSeat,
}: {
  action: PaifuAction;
  callerSeat: SeatWind;
  claimedSeat?: SeatWind;
}): MeldTile[] {
  const fallbackCount = isKanAction(action) ? 4 : 3;
  const revealedTiles =
    action.revealedTiles.length > 0
      ? [...action.revealedTiles]
      : repeatTile(action.tile ?? undefined, fallbackCount);
  const tiles =
    action.actionType === 'Chi'
      ? [
          ...(action.tile ? [action.tile] : []),
          ...removeFirstMatchingTile(revealedTiles, action.tile ?? undefined),
        ]
      : revealedTiles;
  const sidewaysIndex = getOpenMeldSidewaysIndex({
    action,
    callerSeat,
    claimedSeat,
    tileCount: tiles.length,
  });

  return tiles.map((tile, index) => ({
    tile,
    sideways: index === sidewaysIndex,
  }));
}

export function getClosedKanTiles(action: PaifuAction): MeldTile[] {
  const baseTile = action.tile ?? action.revealedTiles[0];
  const revealedTiles =
    action.revealedTiles.length >= 4
      ? [...action.revealedTiles]
      : repeatTile(baseTile, 4);
  const visibleSecondTile =
    revealedTiles[1] &&
    baseTile &&
    !isSamePaifuTile(revealedTiles[1], baseTile)
      ? revealedTiles[1]
      : getRedFiveTile(baseTile);
  const tiles = [
    revealedTiles[0] ?? baseTile,
    visibleSecondTile,
    revealedTiles[2] ?? baseTile,
    revealedTiles[3] ?? baseTile,
  ].filter((tile): tile is PaifuTile => Boolean(tile));

  return tiles.map((tile, index) => ({
    tile,
    concealed: index === 0 || index === 3,
  }));
}

export function isCallAction(action: PaifuAction) {
  return (
    action.actionType === 'Chi' ||
    action.actionType === 'Pon' ||
    action.actionType === 'Kan' ||
    action.actionType === 'OpenKan'
  );
}

export function isKanAction(action: PaifuAction) {
  return (
    action.actionType === 'Kan' ||
    action.actionType === 'OpenKan' ||
    action.actionType === 'ClosedKan' ||
    action.actionType === 'AddedKan'
  );
}

function getRedFiveTile(tile?: PaifuTile) {
  if (
    !tile ||
    tile.rank !== 5 ||
    tile.suit === PaifuTileSuit.Honor
  ) {
    return tile;
  }

  return { rank: 0, suit: tile.suit };
}

function repeatTile(tile: PaifuTile | undefined, count: number) {
  return tile ? Array.from({ length: count }, () => tile) : [];
}
