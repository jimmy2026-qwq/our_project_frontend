import type { SeatWind } from '@/objects/tournament';

import type { PaifuAction, TablePaifuDetail } from '../types';
import { getPlayerSeat, seatOrder } from './getReplayCore';
import type { MeldTile, RiverDiscard } from '../objects/ReplaySnapshot.types';
import { removeFirstMatchingTile } from './getReplaySnapshotHands';
import { getOpenMeldSidewaysIndex } from './getReplaySnapshotRelations';

export function claimDiscard({
  action,
  callerSeat,
  paifu,
  rivers,
}: {
  action: PaifuAction;
  callerSeat: SeatWind;
  paifu: TablePaifuDetail;
  rivers: Record<SeatWind, RiverDiscard[]>;
}) {
  const explicitClaim = claimExplicitDiscard({ action, paifu, rivers });

  if (explicitClaim) {
    return explicitClaim;
  }

  return claimLegacyDiscard(rivers, callerSeat, action.tile);
}

function claimExplicitDiscard({
  action,
  paifu,
  rivers,
}: {
  action: PaifuAction;
  paifu: TablePaifuDetail;
  rivers: Record<SeatWind, RiverDiscard[]>;
}) {
  if (action.targetSequenceNo) {
    return claimDiscardBySequenceNo(rivers, action.targetSequenceNo);
  }

  if (action.fromPlayer && action.tile) {
    const fromSeat = getPlayerSeat(paifu, action.fromPlayer);

    return fromSeat
      ? claimDiscardFromSeat(rivers, fromSeat, action.tile)
      : undefined;
  }

  return undefined;
}

function claimDiscardBySequenceNo(
  rivers: Record<SeatWind, RiverDiscard[]>,
  targetSequenceNo: number,
) {
  for (const seat of seatOrder) {
    const river = rivers[seat];
    const claimedIndex = river.findIndex(
      (discard) => discard.sequenceNo === targetSequenceNo,
    );

    if (claimedIndex >= 0) {
      return removeClaimedDiscard(rivers, seat, claimedIndex);
    }
  }

  return undefined;
}

function claimDiscardFromSeat(
  rivers: Record<SeatWind, RiverDiscard[]>,
  seat: SeatWind,
  tile: string,
) {
  const claimedIndex = findLastDiscardIndex(rivers[seat], tile);

  return claimedIndex >= 0
    ? removeClaimedDiscard(rivers, seat, claimedIndex)
    : undefined;
}

function claimLegacyDiscard(
  rivers: Record<SeatWind, RiverDiscard[]>,
  callerSeat: SeatWind,
  tile?: string,
) {
  if (!tile) {
    return undefined;
  }

  for (const seat of seatOrder) {
    if (seat === callerSeat) {
      continue;
    }

    const claimed = claimDiscardFromSeat(rivers, seat, tile);

    if (claimed) {
      return claimed;
    }
  }

  return undefined;
}

function removeClaimedDiscard(
  rivers: Record<SeatWind, RiverDiscard[]>,
  seat: SeatWind,
  claimedIndex: number,
) {
  const [discard] = rivers[seat].slice(claimedIndex, claimedIndex + 1);
  rivers[seat] = rivers[seat].filter((_, index) => index !== claimedIndex);

  return discard ? { discard, seat } : undefined;
}

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
      : repeatTile(action.tile, fallbackCount);
  const tiles =
    action.actionType === 'Chi'
      ? [
          ...(action.tile ? [action.tile] : []),
          ...removeFirstMatchingTile(revealedTiles, action.tile),
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
    revealedTiles[1] && revealedTiles[1] !== baseTile
      ? revealedTiles[1]
      : getRedFiveTile(baseTile);
  const tiles = [
    revealedTiles[0] ?? baseTile,
    visibleSecondTile,
    revealedTiles[2] ?? baseTile,
    revealedTiles[3] ?? baseTile,
  ].filter((tile): tile is string => Boolean(tile));

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

function findLastDiscardIndex(river: RiverDiscard[], tile: string) {
  for (let index = river.length - 1; index >= 0; index -= 1) {
    if (river[index]?.tile === tile) {
      return index;
    }
  }

  return -1;
}

function getRedFiveTile(tile?: string) {
  if (!tile || !tile.startsWith('5')) {
    return tile;
  }

  const suit = tile.slice(1);

  return suit === 'm' || suit === 'p' || suit === 's' ? `0${suit}` : tile;
}

function repeatTile(tile: string | undefined, count: number) {
  return tile ? Array.from({ length: count }, () => tile) : [];
}
