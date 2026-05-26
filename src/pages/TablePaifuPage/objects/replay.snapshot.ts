import type { SeatWind } from '@/objects/tournament';

import type { PaifuAction, PaifuRoundSummary, TablePaifuDetail } from '../types';
import {
  getPlayerSeat,
  getReplaySequenceLimit,
  removeFirstTile,
  seatOrder,
} from './replay.core';

export type RiverDiscard = {
  tile: string;
  sideways?: boolean;
};

export type MeldTile = {
  tile: string;
  sideways?: boolean;
  concealed?: boolean;
};

export type MeldGroup = {
  actionType: string;
  tiles: MeldTile[];
};

function claimLastDiscard(
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

    const river = rivers[seat];
    let claimedIndex = -1;

    for (let index = river.length - 1; index >= 0; index -= 1) {
      if (river[index]?.tile === tile) {
        claimedIndex = index;
        break;
      }
    }

    if (claimedIndex >= 0) {
      const [discard] = river.slice(claimedIndex, claimedIndex + 1);
      rivers[seat] = river.filter((_, index) => index !== claimedIndex);
      return discard ? { discard, seat } : undefined;
    }
  }

  return undefined;
}

function isCallAction(action: PaifuAction) {
  return (
    action.actionType === 'Chi' ||
    action.actionType === 'Pon' ||
    action.actionType === 'Kan' ||
    action.actionType === 'OpenKan'
  );
}

function isKanAction(action: PaifuAction) {
  return (
    action.actionType === 'Kan' ||
    action.actionType === 'OpenKan' ||
    action.actionType === 'ClosedKan' ||
    action.actionType === 'AddedKan'
  );
}

function shouldApplyHandSnapshot(action: PaifuAction, round: PaifuRoundSummary) {
  return !(action.actionType === 'Win' && round.result.outcome === 'Ron');
}

function repeatTile(tile: string | undefined, count: number) {
  return tile ? Array.from({ length: count }, () => tile) : [];
}

function removeFirstMatchingTile(tiles: string[], tile?: string) {
  if (!tile) {
    return [...tiles];
  }

  const index = tiles.findIndex((item) => item === tile);

  if (index < 0) {
    return [...tiles];
  }

  return tiles.filter((_, tileIndex) => tileIndex !== index);
}

function getClaimRelation(callerSeat: SeatWind, claimedSeat: SeatWind) {
  const callerIndex = seatOrder.indexOf(callerSeat);
  const claimedIndex = seatOrder.indexOf(claimedSeat);
  const relation = (claimedIndex - callerIndex + seatOrder.length) % seatOrder.length;

  if (relation === 3) {
    return 'upper';
  }

  if (relation === 2) {
    return 'opposite';
  }

  if (relation === 1) {
    return 'lower';
  }

  return 'self';
}

function getOpenMeldSidewaysIndex({
  action,
  callerSeat,
  claimedSeat,
  tileCount,
}: {
  action: PaifuAction;
  callerSeat: SeatWind;
  claimedSeat?: SeatWind;
  tileCount: number;
}) {
  if (action.actionType === 'Chi') {
    return 0;
  }

  if (!claimedSeat) {
    return undefined;
  }

  const relation = getClaimRelation(callerSeat, claimedSeat);

  if (tileCount >= 4) {
    if (relation === 'upper') {
      return 0;
    }

    if (relation === 'opposite') {
      return 1;
    }

    if (relation === 'lower') {
      return 3;
    }
  }

  if (relation === 'upper') {
    return 0;
  }

  if (relation === 'opposite') {
    return 1;
  }

  if (relation === 'lower') {
    return 2;
  }

  return undefined;
}

function getOpenMeldTiles({
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

function getRedFiveTile(tile?: string) {
  if (!tile || !tile.startsWith('5')) {
    return tile;
  }

  const suit = tile.slice(1);

  return suit === 'm' || suit === 'p' || suit === 's' ? `0${suit}` : tile;
}

function getClosedKanTiles(action: PaifuAction): MeldTile[] {
  const baseTile = action.tile ?? action.revealedTiles[0];
  const revealedTiles =
    action.revealedTiles.length >= 4 ? [...action.revealedTiles] : repeatTile(baseTile, 4);
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

function getAddedTileIndex({
  afterTiles,
  beforeTiles,
  preferredTile,
}: {
  afterTiles: string[];
  beforeTiles: string[];
  preferredTile?: string;
}) {
  const remainingBeforeCounts = beforeTiles.reduce<Record<string, number>>(
    (counts, tile) => ({
      ...counts,
      [tile]: (counts[tile] ?? 0) + 1,
    }),
    {},
  );

  const addedIndex = afterTiles.findIndex((tile) => {
    const remainingCount = remainingBeforeCounts[tile] ?? 0;

    if (remainingCount > 0) {
      remainingBeforeCounts[tile] = remainingCount - 1;
      return false;
    }

    return !preferredTile || tile === preferredTile;
  });

  if (addedIndex >= 0) {
    return addedIndex;
  }

  const preferredIndex = preferredTile
    ? afterTiles.findIndex((tile) => tile === preferredTile)
    : -1;

  return preferredIndex >= 0 ? preferredIndex : afterTiles.length - 1;
}

export function getReplaySnapshot(
  paifu: TablePaifuDetail,
  round: PaifuRoundSummary,
  replayStep: number,
) {
  const hands = Object.fromEntries(
    Object.entries(round.initialHands).map(([playerId, tiles]) => [
      playerId,
      [...tiles],
    ]),
  );
  const rivers: Record<SeatWind, RiverDiscard[]> = {
    East: [],
    South: [],
    West: [],
    North: [],
  };
  const melds: Record<SeatWind, MeldGroup[]> = {
    East: [],
    South: [],
    West: [],
    North: [],
  };
  const pendingRiichiSideways: Record<SeatWind, boolean> = {
    East: false,
    South: false,
    West: false,
    North: false,
  };
  const drawnTileIndexes: Record<string, number | undefined> = {};

  const sequenceLimit = getReplaySequenceLimit(round, replayStep);

  round.actions
    .filter((action) => action.sequenceNo <= sequenceLimit)
    .forEach((action) => {
      if (!action.actor) {
        return;
      }

      const actorSeat = getPlayerSeat(paifu, action.actor);
      if (!actorSeat) {
        return;
      }

      if (action.actionType === 'Draw' && action.handTilesAfterAction) {
        const beforeTiles = hands[action.actor] ?? [];
        const afterTiles = [...action.handTilesAfterAction];

        hands[action.actor] = afterTiles;
        drawnTileIndexes[action.actor] = getAddedTileIndex({
          afterTiles,
          beforeTiles,
          preferredTile: action.tile,
        });
      } else if (
        action.handTilesAfterAction &&
        shouldApplyHandSnapshot(action, round)
      ) {
        hands[action.actor] = [...action.handTilesAfterAction];
      }

      if (
        action.tile &&
        (action.actionType === 'Discard' || action.actionType === 'Riichi')
      ) {
        const sideways =
          action.actionType === 'Riichi' || pendingRiichiSideways[actorSeat];

        hands[action.actor] = action.handTilesAfterAction
          ? hands[action.actor]
          : removeFirstTile(hands[action.actor] ?? [], action.tile);
        drawnTileIndexes[action.actor] = undefined;
        pendingRiichiSideways[actorSeat] = false;
        rivers[actorSeat] = [
          ...rivers[actorSeat],
          { tile: action.tile, sideways },
        ];
      }

      if (isCallAction(action)) {
        const claimed = claimLastDiscard(rivers, actorSeat, action.tile);

        if (claimed?.discard.sideways) {
          pendingRiichiSideways[claimed.seat] = true;
        }

        melds[actorSeat] = [
          ...melds[actorSeat],
          {
            actionType: action.actionType,
            tiles: getOpenMeldTiles({
              action,
              callerSeat: actorSeat,
              claimedSeat: claimed?.seat,
            }),
          },
        ];
      }

      if (action.actionType === 'ClosedKan') {
        melds[actorSeat] = [
          ...melds[actorSeat],
          {
            actionType: action.actionType,
            tiles: getClosedKanTiles(action),
          },
        ];
      }

      if (action.actionType === 'AddedKan') {
        melds[actorSeat] = [
          ...melds[actorSeat],
          {
            actionType: action.actionType,
            tiles: getOpenMeldTiles({ action, callerSeat: actorSeat }),
          },
        ];
      }

      if (action.actionType === 'Win' || action.actionType === 'DrawGame') {
        drawnTileIndexes[action.actor] = undefined;
      }
    });

  return { drawnTileIndexes, hands, melds, rivers };
}
