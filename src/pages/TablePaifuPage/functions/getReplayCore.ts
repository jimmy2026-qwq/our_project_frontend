import { getPaifuRoundActions } from '@/pages/TablePaifuPage/functions/getPaifuRoundData';
import type { SeatWind } from '@/objects/tournament';

import {
  isSamePaifuTile,
  type PaifuAction,
  type PaifuRound as PaifuRoundSummary,
  type PaifuTile,
} from '@/objects';

export const seatOrder: SeatWind[] = ['East', 'South', 'West', 'North'];

export const seatLabels: Record<SeatWind, string> = {
  East: '\u4e1c',
  South: '\u5357',
  West: '\u897f',
  North: '\u5317',
};

const roundWindLabels: Record<SeatWind, string> = seatLabels;

export function getRoundTitle(round: PaifuRoundSummary) {
  return `${roundWindLabels[round.descriptor.roundWind]}${round.descriptor.handNumber}\u5c40${round.descriptor.honba}\u672c\u573a`;
}

export function formatPoints(value?: number) {
  if (typeof value !== 'number') {
    return '-';
  }

  return value.toLocaleString('en-US');
}

export function formatYakuValue(han: number) {
  if (han === 13) {
    return '\u5f79\u6ee1';
  }

  if (han === 26) {
    return '\u4e24\u500d\u5f79\u6ee1';
  }

  return `${han} \u756a`;
}

export function getReplayActions(round: PaifuRoundSummary) {
  return getPaifuRoundActions(round).filter((action) =>
    Boolean(
      action.actor &&
      (action.actionType === 'Discard' ||
        (action.actionType === 'Riichi' && action.tile) ||
        action.actionType === 'DrawGame' ||
        action.actionType === 'Win' ||
        action.actionType === 'Chi' ||
        action.actionType === 'Pon' ||
        action.actionType === 'Kan' ||
        action.actionType === 'AddedKan' ||
        action.actionType === 'ClosedKan' ||
        action.actionType === 'OpenKan'),
    ),
  );
}

export function isExhaustiveDrawRound(round: PaifuRoundSummary) {
  return round.result.outcome === 'ExhaustiveDraw';
}

export function getReplayStepCount(round: PaifuRoundSummary) {
  return (
    getReplayActions(round).length + (isExhaustiveDrawRound(round) ? 1 : 0)
  );
}

export function isExhaustiveDrawResultStep(
  round: PaifuRoundSummary,
  replayStep: number,
) {
  return (
    isExhaustiveDrawRound(round) && replayStep >= getReplayStepCount(round)
  );
}

export function getReplaySequenceLimit(
  round: PaifuRoundSummary,
  replayStep: number,
) {
  const replayActions = getReplayActions(round);

  if (replayStep <= 0) {
    return (replayActions[0]?.sequenceNo ?? 1) - 1;
  }

  const currentAction =
    replayActions[Math.min(replayStep, replayActions.length) - 1];
  const nextAction = replayActions[Math.min(replayStep, replayActions.length)];

  if (!currentAction) {
    return 0;
  }

  return nextAction ? nextAction.sequenceNo - 1 : currentAction.sequenceNo;
}

function isRiichiDeclarationRon(round: PaifuRoundSummary, action: PaifuAction) {
  if (
    round.result.outcome !== 'Ron' ||
    !action.actor ||
    !action.tile ||
    round.result.target !== action.actor
  ) {
    return false;
  }

  const actionTile = action.tile;

  return getPaifuRoundActions(round).some(
    (item) =>
      item.actionType === 'Win' &&
      item.sequenceNo > action.sequenceNo &&
      item.tile &&
      isSamePaifuTile(item.tile, actionTile),
  );
}

export function getAcceptedRiichiActions(
  round: PaifuRoundSummary,
  sequenceLimit = Number.POSITIVE_INFINITY,
) {
  return getPaifuRoundActions(round).filter(
    (action) =>
      action.actionType === 'Riichi' &&
      action.actor &&
      action.sequenceNo <= sequenceLimit &&
      !isRiichiDeclarationRon(round, action),
  );
}

export function getDoraIndicators(
  round: PaifuRoundSummary,
  replayStep: number,
) {
  const sequenceLimit = getReplaySequenceLimit(round, replayStep);

  return getPaifuRoundActions(round)
    .filter(
      (action) =>
        action.actionType === 'DoraReveal' &&
        action.tile &&
        action.sequenceNo <= sequenceLimit,
    )
    .map((action) => action.tile as PaifuTile);
}

export function getVisibleDoraIndicatorCount(
  round: PaifuRoundSummary,
  replayStep: number,
) {
  return Math.max(1, getDoraIndicators(round, replayStep).length);
}

export function getRemainingTileCount(
  round: PaifuRoundSummary,
  replayStep: number,
) {
  const sequenceLimit = getReplaySequenceLimit(round, replayStep);
  const drawCount = getPaifuRoundActions(round).filter(
    (action) =>
      action.actionType === 'Draw' && action.sequenceNo <= sequenceLimit,
  ).length;

  return Math.max(0, 69 - drawCount);
}

export function isWinningRound(round: PaifuRoundSummary) {
  return round.result.outcome === 'Ron' || round.result.outcome === 'Tsumo';
}

export function removeFirstTile(tiles: PaifuTile[], tile: PaifuTile) {
  const targetIndex = tiles.findIndex((item) => isSamePaifuTile(item, tile));

  if (targetIndex < 0) {
    return tiles;
  }

  return tiles.filter((_, index) => index !== targetIndex);
}
