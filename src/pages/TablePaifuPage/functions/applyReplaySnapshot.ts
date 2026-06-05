import type { SeatWind } from '@/objects/tournament';

import type {
  PaifuAction,
  PaifuRoundSummary,
  TablePaifuDetail,
} from '../types';
import { getPlayerSeat, removeFirstTile } from './getReplayCore';
import { getAddedTileIndex } from './getReplaySnapshotHands';
import {
  claimDiscard,
  getClosedKanTiles,
  getOpenMeldTiles,
  isCallAction,
} from './getReplaySnapshotMelds';
import type { MeldGroup, RiverDiscard } from '../objects/ReplaySnapshot.types';

export function applySnapshotAction({
  action,
  drawnTileIndexes,
  hands,
  melds,
  paifu,
  pendingRiichiSideways,
  round,
  rivers,
}: {
  action: PaifuAction;
  drawnTileIndexes: Record<string, number | undefined>;
  hands: Record<string, string[]>;
  melds: Record<SeatWind, MeldGroup[]>;
  paifu: TablePaifuDetail;
  pendingRiichiSideways: Record<SeatWind, boolean>;
  round: PaifuRoundSummary;
  rivers: Record<SeatWind, RiverDiscard[]>;
}) {
  if (!action.actor) {
    return;
  }

  const actorSeat = getPlayerSeat(paifu, action.actor);
  if (!actorSeat) {
    return;
  }

  applyHandSnapshot(action, hands, drawnTileIndexes, round);
  applyRiverSnapshot({
    action,
    actorSeat,
    drawnTileIndexes,
    hands,
    pendingRiichiSideways,
    rivers,
  });
  applyMeldSnapshot({
    action,
    actorSeat,
    melds,
    paifu,
    pendingRiichiSideways,
    rivers,
  });

  if (action.actionType === 'Win' || action.actionType === 'DrawGame') {
    drawnTileIndexes[action.actor] = undefined;
  }
}

function applyHandSnapshot(
  action: PaifuAction,
  hands: Record<string, string[]>,
  drawnTileIndexes: Record<string, number | undefined>,
  round: PaifuRoundSummary,
) {
  if (!action.actor) {
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
  } else if (action.handTilesAfterAction) {
    hands[action.actor] = getVisibleHandTilesAfterAction({
      action,
      currentTiles: hands[action.actor] ?? [],
      round,
    });
  }
}

function getVisibleHandTilesAfterAction({
  action,
  currentTiles,
  round,
}: {
  action: PaifuAction;
  currentTiles: string[];
  round: PaifuRoundSummary;
}) {
  const afterTiles = [...(action.handTilesAfterAction ?? [])];

  if (
    action.actionType !== 'Win' ||
    round.result.outcome !== 'Ron' ||
    !action.tile ||
    afterTiles.length <= currentTiles.length
  ) {
    return afterTiles;
  }

  return removeFirstTile(afterTiles, action.tile);
}

function applyRiverSnapshot({
  action,
  actorSeat,
  drawnTileIndexes,
  hands,
  pendingRiichiSideways,
  rivers,
}: {
  action: PaifuAction;
  actorSeat: SeatWind;
  drawnTileIndexes: Record<string, number | undefined>;
  hands: Record<string, string[]>;
  pendingRiichiSideways: Record<SeatWind, boolean>;
  rivers: Record<SeatWind, RiverDiscard[]>;
}) {
  if (
    !action.actor ||
    !action.tile ||
    (action.actionType !== 'Discard' && action.actionType !== 'Riichi')
  ) {
    return;
  }

  const sideways =
    action.actionType === 'Riichi' || pendingRiichiSideways[actorSeat];

  hands[action.actor] = action.handTilesAfterAction
    ? hands[action.actor]
    : removeFirstTile(hands[action.actor] ?? [], action.tile);
  drawnTileIndexes[action.actor] = undefined;
  pendingRiichiSideways[actorSeat] = false;
  rivers[actorSeat] = [
    ...rivers[actorSeat],
    {
      sequenceNo: action.sequenceNo,
      playerId: action.actor,
      tile: action.tile,
      sideways,
    },
  ];
}

function applyMeldSnapshot({
  action,
  actorSeat,
  melds,
  paifu,
  pendingRiichiSideways,
  rivers,
}: {
  action: PaifuAction;
  actorSeat: SeatWind;
  melds: Record<SeatWind, MeldGroup[]>;
  paifu: TablePaifuDetail;
  pendingRiichiSideways: Record<SeatWind, boolean>;
  rivers: Record<SeatWind, RiverDiscard[]>;
}) {
  if (isCallAction(action)) {
    const claimed = claimDiscard({
      action,
      callerSeat: actorSeat,
      paifu,
      rivers,
    });

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
      { actionType: action.actionType, tiles: getClosedKanTiles(action) },
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
}
