import type { SeatWind } from '@/objects/tournament';

import type {
  PaifuAction,
  PaifuRound as PaifuRoundSummary,
  PaifuTile,
} from '@/objects';
import { PaifuActionType } from '@/objects';
import type { TablePaifuDetail } from '../objects/TablePaifuDetail';
import { removeFirstTile } from './getReplayCore';
import { getPlayerSeat } from './getReplayPlayers';
import { applyHandSnapshot } from './applyReplayHandSnapshot';
import {
  getClosedKanTiles,
  getOpenMeldTiles,
  isCallAction,
} from './getReplaySnapshotMelds';
import { claimDiscard } from './getReplaySnapshotClaims';
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
  hands: Record<string, PaifuTile[]>;
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

  if (
    action.actionType === PaifuActionType.Win ||
    action.actionType === PaifuActionType.DrawGame
  ) {
    drawnTileIndexes[action.actor] = undefined;
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
  hands: Record<string, PaifuTile[]>;
  pendingRiichiSideways: Record<SeatWind, boolean>;
  rivers: Record<SeatWind, RiverDiscard[]>;
}) {
  if (
    !action.actor ||
    !action.tile ||
    (action.actionType !== PaifuActionType.Discard &&
      action.actionType !== PaifuActionType.Riichi)
  ) {
    return;
  }

  const sideways =
    action.actionType === PaifuActionType.Riichi ||
    pendingRiichiSideways[actorSeat];

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

  if (action.actionType === PaifuActionType.ClosedKan) {
    melds[actorSeat] = [
      ...melds[actorSeat],
      { actionType: action.actionType, tiles: getClosedKanTiles(action) },
    ];
  }

  if (action.actionType === PaifuActionType.AddedKan) {
    melds[actorSeat] = [
      ...melds[actorSeat],
      {
        actionType: action.actionType,
        tiles: getOpenMeldTiles({ action, callerSeat: actorSeat }),
      },
    ];
  }
}
