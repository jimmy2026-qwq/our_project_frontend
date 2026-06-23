import { HandOutcome, MahjongGameLengths, MahjongTableStatuses, SeatWind, type AgariResult, type MahjongSeatView, type MahjongTableView } from '@/objects';
import type { CenterScoreDisplay } from '@/pages/TablePaifuPage/components/PaifuHandTable/objects/CenterScoreDisplay';
import { getResultWins, isWinOutcome } from '@/components/mahjong-result/functions/getMahjongResultSequence';

import { matchBoardSeatOrder } from '../objects/matchBoardSeatOrder';

export function shouldCompleteTableAfterCurrentResult(
  mahjongTable: MahjongTableView,
) {
  const result = mahjongTable.currentRound?.result;

  if (!result) {
    return false;
  }

  if (
    mahjongTable.status === MahjongTableStatuses.Finished ||
    mahjongTable.status === MahjongTableStatuses.Archived
  ) {
    return true;
  }

  if (
    mahjongTable.ruleset.bankruptcyEnd &&
    mahjongTable.seats.some((seat) => seat.points < 0)
  ) {
    return true;
  }

  if (mahjongTable.ruleset.gameLength === MahjongGameLengths.OneKyoku) {
    return true;
  }

  const descriptor = mahjongTable.currentRound?.descriptor;

  if (!descriptor) {
    return false;
  }

  const dealerContinues = doesDealerContinueAfterCurrentResult(mahjongTable);
  const isLastScheduledHand = isAtOrBeyondLastScheduledHand(
    descriptor,
    mahjongTable.ruleset.gameLength,
  );

  if (!isLastScheduledHand) {
    return false;
  }

  if (!dealerContinues) {
    return mahjongTable.seats.some(
      (seat) => seat.points >= mahjongTable.ruleset.targetPoints,
    );
  }

  return (
    mahjongTable.ruleset.allLastDealerFinishAsTop &&
    isCurrentDealerTop(mahjongTable)
  );
}

export function createMatchScoreDisplays({
  result,
  seatsByDisplaySeat,
  settlementProgress,
}: {
  result: AgariResult | null;
  seatsByDisplaySeat: Record<SeatWind, MahjongSeatView | null>;
  settlementProgress?: number;
}) {
  if (!result || settlementProgress === undefined) {
    return undefined;
  }

  return Object.fromEntries(
    matchBoardSeatOrder.map((seat) => {
      const seatView = seatsByDisplaySeat[seat];
      const delta =
        result.scoreChanges.find((change) => change.playerId === seatView?.playerId)
          ?.delta ?? 0;
      const finalPoints = seatView?.points ?? 0;
      const basePoints = finalPoints - delta;
      const animatedDelta = normalizeZero(
        Math.round(delta * (1 - settlementProgress)),
      );
      const hasScoreDelta = result.scoreChanges.some(
        (change) => change.delta !== 0,
      );

      return [
        seat,
        {
          delta: animatedDelta,
          points: basePoints + Math.round(delta * settlementProgress),
          showDelta:
            isScoreSettlementOutcome(result.outcome) &&
            hasScoreDelta &&
            settlementProgress < 1,
        },
      ];
    }),
  ) as Record<SeatWind, CenterScoreDisplay>;
}

export function shouldHideWinningHand({
  result,
  resultHandRevealReadyKey,
  resultKey,
  seatView,
  winResultNeedsSequence,
}: {
  result: AgariResult | null;
  resultHandRevealReadyKey: string | null;
  resultKey: string | null;
  seatView: MahjongSeatView | null;
  winResultNeedsSequence: boolean;
}) {
  if (
    !result ||
    !resultKey ||
    !seatView?.playerId ||
    !winResultNeedsSequence ||
    resultHandRevealReadyKey === resultKey
  ) {
    return false;
  }

  return getResultWins(result).some((win) => win.winner === seatView.playerId);
}

function doesDealerContinueAfterCurrentResult(mahjongTable: MahjongTableView) {
  const result = mahjongTable.currentRound?.result;
  const eastPlayerId = mahjongTable.seats.find(
    (seat) => seat.seat === SeatWind.East,
  )?.playerId;

  if (!result || !eastPlayerId) {
    return false;
  }

  if (isWinOutcome(result.outcome)) {
    return getResultWins(result).some((win) => win.winner === eastPlayerId);
  }

  if (result.outcome === HandOutcome.ExhaustiveDraw) {
    return Boolean(result.tenpaiPlayerIds?.includes(eastPlayerId));
  }

  return result.outcome === HandOutcome.AbortiveDraw;
}

function isCurrentDealerTop(mahjongTable: MahjongTableView) {
  const eastSeat = mahjongTable.seats.find(
    (seat) => seat.seat === SeatWind.East,
  );

  return Boolean(
    eastSeat &&
      mahjongTable.seats.every((seat) => eastSeat.points >= seat.points),
  );
}

function isAtOrBeyondLastScheduledHand(
  descriptor: NonNullable<MahjongTableView['currentRound']>['descriptor'],
  gameLength: MahjongTableView['ruleset']['gameLength'],
) {
  return (
    descriptor.handNumber >= 4 &&
    getRoundWindOrder(descriptor.roundWind) >=
      getRoundWindOrder(getLastScheduledRoundWind(gameLength))
  );
}

function getLastScheduledRoundWind(
  gameLength: MahjongTableView['ruleset']['gameLength'],
): SeatWind {
  return gameLength === MahjongGameLengths.Hanchan ? SeatWind.South : SeatWind.East;
}

function getRoundWindOrder(seat: SeatWind) {
  return matchBoardSeatOrder.indexOf(seat);
}

function normalizeZero(value: number) {
  return Object.is(value, -0) ? 0 : value;
}

function isScoreSettlementOutcome(outcome: string) {
  return (
    outcome === HandOutcome.Ron ||
    outcome === HandOutcome.Tsumo ||
    outcome === HandOutcome.ExhaustiveDraw
  );
}
