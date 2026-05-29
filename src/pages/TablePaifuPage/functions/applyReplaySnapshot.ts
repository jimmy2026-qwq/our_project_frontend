import type { SeatWind } from '@/objects/tournament';

import type {
  PaifuAction,
  PaifuRoundSummary,
  TablePaifuDetail,
} from '../types';
import { getPlayerSeat, removeFirstTile } from './getReplayCore';
import { getAddedTileIndex } from './getReplaySnapshotHands';
import {
  claimLastDiscard,
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
  rivers,
  round,
}: {
  action: PaifuAction;
  drawnTileIndexes: Record<string, number | undefined>;
  hands: Record<string, string[]>;
  melds: Record<SeatWind, MeldGroup[]>;
  paifu: TablePaifuDetail;
  pendingRiichiSideways: Record<SeatWind, boolean>;
  rivers: Record<SeatWind, RiverDiscard[]>;
  round: PaifuRoundSummary;
}) {
  if (!action.actor) {
    return;
  }

  const actorSeat = getPlayerSeat(paifu, action.actor);
  if (!actorSeat) {
    return;
  }

  applyHandSnapshot(action, round, hands, drawnTileIndexes);
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
    pendingRiichiSideways,
    rivers,
  });

  if (action.actionType === 'Win' || action.actionType === 'DrawGame') {
    drawnTileIndexes[action.actor] = undefined;
  }
}

function applyHandSnapshot(
  action: PaifuAction,
  round: PaifuRoundSummary,
  hands: Record<string, string[]>,
  drawnTileIndexes: Record<string, number | undefined>,
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
  } else if (
    action.handTilesAfterAction &&
    shouldApplyHandSnapshot(action, round)
  ) {
    hands[action.actor] = [...action.handTilesAfterAction];
  }
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
  rivers[actorSeat] = [...rivers[actorSeat], { tile: action.tile, sideways }];
}

function applyMeldSnapshot({
  action,
  actorSeat,
  melds,
  pendingRiichiSideways,
  rivers,
}: {
  action: PaifuAction;
  actorSeat: SeatWind;
  melds: Record<SeatWind, MeldGroup[]>;
  pendingRiichiSideways: Record<SeatWind, boolean>;
  rivers: Record<SeatWind, RiverDiscard[]>;
}) {
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

function shouldApplyHandSnapshot(
  action: PaifuAction,
  round: PaifuRoundSummary,
) {
  return !(action.actionType === 'Win' && round.result.outcome === 'Ron');
}
