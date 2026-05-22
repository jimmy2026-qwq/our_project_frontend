import type { SeatWind } from '@/objects/tournament/apiTypes';

import type { PaifuAction, PaifuRoundSummary, TablePaifuDetail } from '../types';

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
  return round.actions.filter((action) =>
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
  return getReplayActions(round).length + (isExhaustiveDrawRound(round) ? 1 : 0);
}

export function isExhaustiveDrawResultStep(
  round: PaifuRoundSummary,
  replayStep: number,
) {
  return isExhaustiveDrawRound(round) && replayStep >= getReplayStepCount(round);
}

function getReplaySequenceLimit(round: PaifuRoundSummary, replayStep: number) {
  const replayActions = getReplayActions(round);

  if (replayStep <= 0) {
    return (replayActions[0]?.sequenceNo ?? 1) - 1;
  }

  const currentAction = replayActions[Math.min(replayStep, replayActions.length) - 1];
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

  return round.actions.some(
    (item) =>
      item.actionType === 'Win' &&
      item.sequenceNo > action.sequenceNo &&
      item.tile === action.tile,
  );
}

function getAcceptedRiichiActions(
  round: PaifuRoundSummary,
  sequenceLimit = Number.POSITIVE_INFINITY,
) {
  return round.actions.filter(
    (action) =>
      action.actionType === 'Riichi' &&
      action.actor &&
      action.sequenceNo <= sequenceLimit &&
      !isRiichiDeclarationRon(round, action),
  );
}

export function getDoraIndicators(round: PaifuRoundSummary, replayStep: number) {
  const sequenceLimit = getReplaySequenceLimit(round, replayStep);

  return round.actions
    .filter(
      (action) =>
        action.actionType === 'DoraReveal' &&
        action.tile &&
        action.sequenceNo <= sequenceLimit,
    )
    .map((action) => action.tile as string);
}

export function getVisibleDoraIndicatorCount(
  round: PaifuRoundSummary,
  replayStep: number,
) {
  return Math.max(1, getDoraIndicators(round, replayStep).length);
}

export function getRemainingTileCount(round: PaifuRoundSummary, replayStep: number) {
  const sequenceLimit = getReplaySequenceLimit(round, replayStep);
  const drawCount = round.actions.filter(
    (action) => action.actionType === 'Draw' && action.sequenceNo <= sequenceLimit,
  ).length;

  return Math.max(0, 69 - drawCount);
}

function getRoundRiichiPaymentForPlayer(
  round: PaifuRoundSummary,
  playerId: string,
  sequenceLimit = Number.POSITIVE_INFINITY,
) {
  return (
    getAcceptedRiichiActions(round, sequenceLimit).filter(
      (action) => action.actor === playerId,
    ).length * -1000
  );
}

function isWinningRound(round: PaifuRoundSummary) {
  return round.result.outcome === 'Ron' || round.result.outcome === 'Tsumo';
}

export function getRiichiStickCountBeforeRound(
  rounds: PaifuRoundSummary[],
  selectedRoundIndex: number,
) {
  return rounds.slice(0, selectedRoundIndex).reduce((count, round) => {
    const nextCount = count + getAcceptedRiichiActions(round).length;

    return isWinningRound(round) ? 0 : nextCount;
  }, 0);
}

export function getCurrentRiichiStickCount({
  hasSettlementApplied,
  replayStep,
  round,
  rounds,
  selectedRoundIndex,
}: {
  hasSettlementApplied: boolean;
  replayStep: number;
  round: PaifuRoundSummary;
  rounds: PaifuRoundSummary[];
  selectedRoundIndex: number;
}) {
  if (hasSettlementApplied && isWinningRound(round)) {
    return 0;
  }

  return (
    getRiichiStickCountBeforeRound(rounds, selectedRoundIndex) +
    getAcceptedRiichiActions(round, getReplaySequenceLimit(round, replayStep)).length
  );
}

export function removeFirstTile(tiles: string[], tile: string) {
  const targetIndex = tiles.findIndex((item) => item === tile);

  if (targetIndex < 0) {
    return tiles;
  }

  return tiles.filter((_, index) => index !== targetIndex);
}

export function getPlayerSeat(paifu: TablePaifuDetail, playerId: string) {
  return (
    paifu.metadata.seats?.find((item) => item.playerId === playerId)?.seat ??
    paifu.finalStandings.find((item) => item.playerId === playerId)?.seat
  );
}

export function getRoundPlayerId(paifu: TablePaifuDetail, seat: SeatWind) {
  return (
    paifu.metadata.seats?.find((item) => item.seat === seat)?.playerId ??
    paifu.finalStandings.find((item) => item.seat === seat)?.playerId ??
    ''
  );
}

export function getCurrentPlayerPoints({
  paifu,
  playerId,
  replayStep,
  rounds,
  selectedRoundIndex,
}: {
  paifu: TablePaifuDetail;
  playerId: string;
  replayStep: number;
  rounds: PaifuRoundSummary[];
  selectedRoundIndex: number;
}) {
  const pointsBeforeSettlement = getPlayerPointsBeforeSettlement({
    paifu,
    playerId,
    replayStep,
    rounds,
    selectedRoundIndex,
  });
  const selectedRound = rounds[selectedRoundIndex];
  const hasCompletedSelectedRound =
    Boolean(selectedRound) &&
    getReplayStepCount(selectedRound) > 0 &&
    replayStep >= getReplayStepCount(selectedRound);

  if (!selectedRound || !hasCompletedSelectedRound) {
    return pointsBeforeSettlement;
  }

  return (
    pointsBeforeSettlement +
    (selectedRound.result.scoreChanges.find((item) => item.playerId === playerId)
      ?.delta ?? 0)
  );
}

export function getPlayerPointsBeforeSettlement({
  paifu,
  playerId,
  replayStep,
  rounds,
  selectedRoundIndex,
}: {
  paifu: TablePaifuDetail;
  playerId: string;
  replayStep: number;
  rounds: PaifuRoundSummary[];
  selectedRoundIndex: number;
}) {
  const initialPoints =
    paifu.metadata.seats?.find((item) => item.playerId === playerId)?.initialPoints ??
    0;
  const completedRounds = rounds.slice(0, selectedRoundIndex);
  const selectedRound = rounds[selectedRoundIndex];
  const completedPoints = completedRounds.reduce((total, round) => {
    const scoreChange =
      round.result.scoreChanges.find((item) => item.playerId === playerId)?.delta ??
      0;

    return (
      total +
      scoreChange +
      getRoundRiichiPaymentForPlayer(round, playerId)
    );
  }, initialPoints);

  if (!selectedRound) {
    return completedPoints;
  }

  return (
    completedPoints +
    getRoundRiichiPaymentForPlayer(
      selectedRound,
      playerId,
      getReplaySequenceLimit(selectedRound, replayStep),
    )
  );
}

export function isPlayerTenpai(round: PaifuRoundSummary, playerId: string) {
  if (!isExhaustiveDrawRound(round)) {
    return false;
  }

  return round.result.tenpaiPlayerIds?.includes(playerId) ?? false;
}

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

  getReplayActions(round)
    .slice(0, replayStep)
    .forEach((action) => {
      if (!action.actor) {
        return;
      }

      const actorSeat = getPlayerSeat(paifu, action.actor);
      if (!actorSeat) {
        return;
      }

      if (action.handTilesAfterAction && shouldApplyHandSnapshot(action, round)) {
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
    });

  return { hands, melds, rivers };
}

export function getInitialRoundIndex(rounds: PaifuRoundSummary[]) {
  const firstPlayableIndex = rounds.findIndex(
    (round) => getReplayActions(round).length > 0,
  );

  return firstPlayableIndex >= 0 ? firstPlayableIndex : 0;
}

export function getOperationText(action: PaifuAction, round: PaifuRoundSummary) {
  switch (action.actionType) {
    case 'DrawGame':
      return '\u4e5d\u79cd\u4e5d\u724c';
    case 'Riichi':
      return action.note?.toLowerCase().includes('double riichi') ||
        action.note?.includes('\u4e24\u7acb\u76f4')
        ? '\u4e24\u7acb\u76f4'
        : '\u7acb\u76f4';
    case 'Win':
      return round.result.outcome === 'Tsumo' ? '\u81ea\u6478' : '\u8363';
    case 'Chi':
      return '\u5403';
    case 'Pon':
      return '\u78b0';
    case 'Kan':
    case 'AddedKan':
    case 'ClosedKan':
    case 'OpenKan':
      return '\u6760';
    default:
      return undefined;
  }
}

export function isAbortiveDrawAction(action?: PaifuAction) {
  return action?.actionType === 'DrawGame';
}

export function isWinningAction(action?: PaifuAction) {
  return action?.actionType === 'Win';
}
